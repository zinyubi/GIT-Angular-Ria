# simulation/consumers.py
import asyncio
import json
import math
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from scenariosimulation.models import DeployedAircraft
from users.models import TWCCUser  # custom user


# ---------------------------------------------------------------------------
# Simple simulation data structures (in-memory only)
# ---------------------------------------------------------------------------

@dataclass
class Waypoint:
    lat: float
    lon: float
    alt: float


@dataclass
class AircraftTrackState:
    external_id: str
    name: str
    status_db: str
    waypoints: List[Waypoint] = field(default_factory=list)

    segment_index: int = 0           # current leg index
    segment_t: float = 0.0           # 0..1 progress along current leg
    segment_duration_s: float = 1.0  # seconds to traverse this leg
    speed_mps: float = 250.0
    sim_status: str = "waiting"
    sim_position: Dict[str, float] = field(default_factory=dict)

    # For UI reference only (not used for motion)
    ground_speed_mps: Optional[float] = None
    heading_deg: Optional[float] = None
    last_updated_db: Optional[datetime] = None


@dataclass
class SimulationMeta:
    scenario_id: int
    scenario_name: str
    state: str = "idle"  # idle | running | paused | stopped
    started_at: Optional[datetime] = None
    started_by: Optional[str] = None


# ---------------------------------------------------------------------------
# Global in-process registries (per worker)
# ---------------------------------------------------------------------------

SIM_LOCK = asyncio.Lock()

# scenario_id -> SimulationMeta
SIM_STATES: Dict[int, SimulationMeta] = {}

# scenario_id -> Dict[external_id, AircraftTrackState]
SIM_TRACKS: Dict[int, Dict[str, AircraftTrackState]] = {}

# scenario_id -> asyncio.Task (running loop)
SIM_TASKS: Dict[int, asyncio.Task] = {}

# scenario_id -> connection count
SIM_CONNECTION_COUNTS: Dict[int, int] = {}


# ---------------------------------------------------------------------------
# Helpers: permissions, DB access, distance, etc.
# ---------------------------------------------------------------------------

# Fallback allowed role names, in case you don't use a boolean flag
CONTROL_ROLE_NAMES = {
    "Simulation Controller",
    "Admin",
    "C2",
    "Primary",
}


@database_sync_to_async
def user_can_control_simulation(user: TWCCUser) -> bool:
    """
    Decide if a user can control simulations.

    Logic:
    - Must be authenticated.
    - If user.is_superuser -> allow (optional, remove if you don't want this).
    - If Role.has can_control_simulation=True -> allow.
    - Else, fall back to role name in CONTROL_ROLE_NAMES.
    """
    if not getattr(user, "is_authenticated", False):
        print("[SimPerm] user_can_control_simulation: user is not authenticated")
        return False

    # Optional: superusers are always allowed
    if getattr(user, "is_superuser", False):
        print(
            "[SimPerm] user_can_control_simulation: user",
            user.username,
            "(id=", user.id, ") is superuser → can_control = True",
        )
        return True

    roles_qs = user.roles.all()
    role_names = list(roles_qs.values_list("name", flat=True))

    # Try boolean flag, if it exists
    try:
        has_flag = roles_qs.filter(can_control_simulation=True).exists()
    except Exception:
        has_flag = False

    # Fallback: check names set
    has_name_match = bool(set(role_names) & CONTROL_ROLE_NAMES)

    allowed = has_flag or has_name_match

    print(
        "[SimPerm] user_can_control_simulation:",
        "user =", user.username,
        "| id =", user.id,
        "| role_names =", role_names,
        "| has_flag =", has_flag,
        "| has_name_match =", has_name_match,
        "=> can_control =", allowed,
    )
    return allowed


@database_sync_to_async
def load_tracks_for_scenario(scenario_id: int):
    """
    Load DeployedAircraft and build in-memory waypoints/tracks.
    Returns (scenario_name, tracks_dict).
    """
    qs = (
        DeployedAircraft.objects
        .filter(scenario_id=scenario_id)
        .select_related("aircraft_type", "scenario")
    )

    scenario_name: Optional[str] = None
    tracks: Dict[str, AircraftTrackState] = {}

    for ac in qs:
        if scenario_name is None and ac.scenario is not None:
            scenario_name = ac.scenario.name

        # Build waypoint chain: initial + planned_waypoints
        waypoints: List[Waypoint] = [
            Waypoint(
                lat=ac.initial_latitude,
                lon=ac.initial_longitude,
                alt=ac.initial_altitude_m,
            )
        ]

        for wp in ac.planned_waypoints or []:
            lat = float(wp.get("lat", ac.initial_latitude))
            lon = float(wp.get("lon", ac.initial_longitude))
            alt = float(wp.get("alt", ac.initial_altitude_m))
            waypoints.append(Waypoint(lat=lat, lon=lon, alt=alt))

        track = AircraftTrackState(
            external_id=str(ac.external_id),
            name=ac.name or ac.aircraft_type.name,
            status_db=ac.status,
            waypoints=waypoints,
            speed_mps=ac.ground_speed_mps or 250.0,
            sim_status="waiting" if len(waypoints) <= 1 else "moving",
            sim_position={
                "latitude": ac.initial_latitude,
                "longitude": ac.initial_longitude,
                "altitude_m": ac.initial_altitude_m,
            },
            ground_speed_mps=ac.ground_speed_mps,
            heading_deg=ac.heading_deg,
            last_updated_db=ac.last_updated,
        )

        # Precompute first segment duration
        if len(waypoints) >= 2:
            track.segment_index = 0
            track.segment_t = 0.0
            track.segment_duration_s = compute_segment_duration_s(
                waypoints[0],
                waypoints[1],
                track.speed_mps,
            )
        else:
            track.segment_index = 0
            track.segment_t = 0.0
            track.segment_duration_s = 1.0

        tracks[track.external_id] = track

    if scenario_name is None:
        scenario_name = f"Scenario {scenario_id}"

    print(f"[SimTracks] Loaded {len(tracks)} tracks for scenario {scenario_id} ({scenario_name})")
    return scenario_name, tracks


def haversine_distance_m(lat1, lon1, lat2, lon2) -> float:
    """Rough great-circle distance between 2 lat/lon points (meters)."""
    R = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def compute_segment_duration_s(p1: Waypoint, p2: Waypoint, speed_mps: float) -> float:
    """Estimate time to move from p1 to p2 at given ground speed."""
    speed = max(speed_mps, 1.0)  # avoid zero
    distance = haversine_distance_m(p1.lat, p1.lon, p2.lat, p2.lon)
    duration = distance / speed if distance > 0 else 1.0
    return max(duration, 1.0)


def interpolate_waypoint(p1: Waypoint, p2: Waypoint, t: float) -> Waypoint:
    """Linear interpolation between two waypoints."""
    t = max(0.0, min(1.0, t))
    lat = p1.lat + (p2.lat - p1.lat) * t
    lon = p1.lon + (p2.lon - p1.lon) * t
    alt = p1.alt + (p2.alt - p1.alt) * t
    return Waypoint(lat=lat, lon=lon, alt=alt)


# ---------------------------------------------------------------------------
# Core simulation loop (one per scenario)
# ---------------------------------------------------------------------------

async def run_simulation_loop(scenario_id: int, channel_layer):
    group_name = f"scenario_sim_{scenario_id}"
    print(f"[SimLoop] Started simulation loop for scenario {scenario_id}")

    try:
        while True:
            await asyncio.sleep(1.0)

            async with SIM_LOCK:
                meta = SIM_STATES.get(scenario_id)
                if meta is None:
                    print(f"[SimLoop] No meta for scenario {scenario_id}, stopping loop")
                    break

                if meta.state != "running":
                    # Not running → skip stepping tracks, but keep loop alive
                    continue

                tracks = SIM_TRACKS.get(scenario_id, {})
                if not tracks:
                    continue

                for track in tracks.values():
                    if len(track.waypoints) <= 1:
                        wp = track.waypoints[0]
                        track.sim_position = {
                            "latitude": wp.lat,
                            "longitude": wp.lon,
                            "altitude_m": wp.alt,
                        }
                        track.sim_status = "waiting"
                        continue

                    if track.sim_status == "arrived":
                        continue

                    i = track.segment_index
                    if i >= len(track.waypoints) - 1:
                        last_wp = track.waypoints[-1]
                        track.sim_position = {
                            "latitude": last_wp.lat,
                            "longitude": last_wp.lon,
                            "altitude_m": last_wp.alt,
                        }
                        track.sim_status = "arrived"
                        continue

                    p1 = track.waypoints[i]
                    p2 = track.waypoints[i + 1]

                    dt = 1.0
                    track.segment_t += dt / track.segment_duration_s

                    if track.segment_t >= 1.0:
                        track.segment_index += 1
                        if track.segment_index >= len(track.waypoints) - 1:
                            last_wp = track.waypoints[-1]
                            track.sim_position = {
                                "latitude": last_wp.lat,
                                "longitude": last_wp.lon,
                                "altitude_m": last_wp.alt,
                            }
                            track.sim_status = "arrived"
                            continue
                        else:
                            track.segment_t = 0.0
                            p1 = track.waypoints[track.segment_index]
                            p2 = track.waypoints[track.segment_index + 1]
                            track.segment_duration_s = compute_segment_duration_s(
                                p1, p2, track.speed_mps
                            )

                    interp = interpolate_waypoint(p1, p2, track.segment_t)
                    track.sim_position = {
                        "latitude": interp.lat,
                        "longitude": interp.lon,
                        "altitude_m": interp.alt,
                    }
                    track.sim_status = "moving"

                snapshot = build_snapshot_payload(scenario_id, meta, tracks)

            await channel_layer.group_send(
                group_name,
                {
                    "type": "simulation.snapshot",
                    "data": snapshot,
                },
            )
    except asyncio.CancelledError:
        print(f"[SimLoop] Loop for scenario {scenario_id} was cancelled")
        raise
    except Exception as e:
        print(f"[SimLoop] ERROR in loop for scenario {scenario_id}:", e)


def build_snapshot_payload(
    scenario_id: int,
    meta: SimulationMeta,
    tracks: Dict[str, AircraftTrackState],
) -> dict:
    aircraft_list = []
    for t in tracks.values():
        aircraft_list.append({
            "external_id": t.external_id,
            "name": t.name,
            "status_db": t.status_db,
            "position_db": None,
            "sim_status": t.sim_status,
            "sim_position": t.sim_position,
            "ground_speed_mps": t.ground_speed_mps,
            "heading_deg": t.heading_deg,
            "last_updated_db": (
                t.last_updated_db.isoformat() if t.last_updated_db else None
            ),
        })

    return {
        "type": "snapshot",
        "scenario_id": scenario_id,
        "scenario_name": meta.scenario_name,
        "state": meta.state,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "aircraft_count": len(aircraft_list),
        "aircraft": aircraft_list,
    }


# ---------------------------------------------------------------------------
# SimulationConsumer: per-scenario WS (view + control)
# ---------------------------------------------------------------------------

class SimulationConsumer(AsyncWebsocketConsumer):
    """
    Per-scenario WebSocket:
      ws://host/ws/simulation/<scenario_id>/

    Everyone with access to the screen can connect/watch.
    Only authorised roles can send control actions.
    """

    async def connect(self):
        self.scenario_id = int(self.scope["url_route"]["kwargs"]["scenario_id"])
        self.group_name = f"scenario_sim_{self.scenario_id}"

        user = self.scope.get("user")
        print("[SimConsumer] connect() for scenario", self.scenario_id)
        print(
            "[SimConsumer] scope.user =",
            getattr(user, "username", None),
            "| id =", getattr(user, "id", None),
            "| is_authenticated =", getattr(user, "is_authenticated", False),
        )

        # Permission: can this user control?
        self.can_control = await user_can_control_simulation(user)
        print("[SimConsumer] can_control =", self.can_control)

        async with SIM_LOCK:
            SIM_CONNECTION_COUNTS[self.scenario_id] = (
                SIM_CONNECTION_COUNTS.get(self.scenario_id, 0) + 1
            )
            print(
                f"[SimConsumer] scenario {self.scenario_id} connections =",
                SIM_CONNECTION_COUNTS[self.scenario_id],
            )

            if self.scenario_id not in SIM_STATES:
                scenario_name, tracks = await load_tracks_for_scenario(self.scenario_id)
                SIM_STATES[self.scenario_id] = SimulationMeta(
                    scenario_id=self.scenario_id,
                    scenario_name=scenario_name,
                    state="idle",
                    started_at=None,
                    started_by=None,
                )
                SIM_TRACKS[self.scenario_id] = tracks
                print(
                    f"[SimConsumer] Created new SimulationMeta for scenario "
                    f"{self.scenario_id} ({scenario_name}), tracks={len(tracks)}"
                )

            if self.scenario_id not in SIM_TASKS or SIM_TASKS[self.scenario_id].done():
                print(f"[SimConsumer] Starting sim loop task for scenario {self.scenario_id}")
                SIM_TASKS[self.scenario_id] = asyncio.create_task(
                    run_simulation_loop(self.scenario_id, self.channel_layer)
                )

            meta = SIM_STATES[self.scenario_id]
            snapshot = build_snapshot_payload(
                self.scenario_id,
                meta,
                SIM_TRACKS.get(self.scenario_id, {}),
            )

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        await self.send_json({
            "type": "info",
            "message": "Connected to scenario simulation",
            "scenario_id": self.scenario_id,
            "scenario_name": meta.scenario_name,
            "sim_state": meta.state,
            "can_control": self.can_control,
            "available_actions": ["start", "pause", "stop", "reset"],
            "initial_snapshot": snapshot,
        })

    async def disconnect(self, close_code):
        print(f"[SimConsumer] disconnect() scenario {self.scenario_id}, code={close_code}")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

        async with SIM_LOCK:
            SIM_CONNECTION_COUNTS[self.scenario_id] = (
                SIM_CONNECTION_COUNTS.get(self.scenario_id, 1) - 1
            )
            print(
                f"[SimConsumer] scenario {self.scenario_id} connections after disconnect =",
                SIM_CONNECTION_COUNTS[self.scenario_id],
            )
            if SIM_CONNECTION_COUNTS[self.scenario_id] <= 0:
                print(
                    f"[SimConsumer] No more connections for scenario {self.scenario_id}, "
                    f"stopping loop but keeping state."
                )
                SIM_CONNECTION_COUNTS.pop(self.scenario_id, None)

                task = SIM_TASKS.pop(self.scenario_id, None)
                if task and not task.done():
                    task.cancel()

                # IMPORTANT: we DO NOT delete SIM_STATES or SIM_TRACKS here.
                # That way, when a new client connects, they still see the last
                # known state ("running", "paused", etc.) and current positions.

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        print(f"[SimConsumer] receive() raw text_data={text_data}")
        try:
            msg = json.loads(text_data)
        except json.JSONDecodeError:
            print("[SimConsumer] Invalid JSON from client")
            await self.send_json({"type": "error", "error": "Invalid JSON"})
            return

        action = (msg.get("action") or "").lower()
        print("[SimConsumer] Parsed action =", action)
        if not action:
            return

        if not self.can_control:
            print("[SimConsumer] User not allowed to control simulation, sending error")
            await self.send_json({
                "type": "error",
                "error": "You are not allowed to control this simulation.",
            })
            return

        async with SIM_LOCK:
            meta = SIM_STATES.get(self.scenario_id)
            if not meta:
                print("[SimConsumer] No SimulationMeta initialized for this scenario")
                await self.send_json({
                    "type": "error",
                    "error": "Simulation state not initialized.",
                })
                return

            user = self.scope.get("user")
            now = datetime.now(timezone.utc)

            if action == "start":
                meta.state = "running"
                meta.started_by = (
                    user.username if getattr(user, "is_authenticated", False) else None
                )
                meta.started_at = now

            elif action == "pause":
                meta.state = "paused"

            elif action == "stop":
                meta.state = "stopped"

            elif action == "reset":
                scenario_name, tracks = await load_tracks_for_scenario(self.scenario_id)
                meta.scenario_name = scenario_name
                meta.state = "idle"
                meta.started_at = None
                meta.started_by = None
                SIM_TRACKS[self.scenario_id] = tracks
                print(
                    f"[SimConsumer] Reset scenario {self.scenario_id} - "
                    f"tracks reloaded: {len(tracks)}"
                )

            else:
                print("[SimConsumer] Unknown action", action)
                await self.send_json({
                    "type": "error",
                    "error": f"Unknown action '{action}'",
                })
                return

            snapshot = build_snapshot_payload(
                self.scenario_id,
                meta,
                SIM_TRACKS.get(self.scenario_id, {}),
            )

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "simulation.state",
                "data": {
                    "type": "control_ack",
                    "scenario_id": self.scenario_id,
                    "action": action,
                    "state": meta.state,
                    "by_user": user.username
                    if getattr(user, "is_authenticated", False)
                    else None,
                    "timestamp": now.isoformat(),
                    "snapshot": snapshot,
                },
            },
        )

        await self.channel_layer.group_send(
            "simulation_monitor",
            {
                "type": "simulation.state",
                "data": {
                    "type": "simulation_state",
                    "scenario_id": self.scenario_id,
                    "scenario_name": meta.scenario_name,
                    "state": meta.state,
                    "started_by": meta.started_by,
                    "started_at": meta.started_at.isoformat()
                    if meta.started_at
                    else None,
                },
            },
        )

    async def simulation_snapshot(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def simulation_state(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def send_json(self, payload: dict):
        await self.send(text_data=json.dumps(payload, default=str))


# ---------------------------------------------------------------------------
# SimulationMonitorConsumer: global list of simulations
# ---------------------------------------------------------------------------

class SimulationMonitorConsumer(AsyncWebsocketConsumer):
    """Global monitor WebSocket: ws://host/ws/simulations/monitor/"""

    async def connect(self):
        print("[SimMonitor] connect()")
        await self.channel_layer.group_add("simulation_monitor", self.channel_name)
        await self.accept()

        async with SIM_LOCK:
            sims = [
                {
                    "scenario_id": meta.scenario_id,
                    "scenario_name": meta.scenario_name,
                    "state": meta.state,
                    "started_by": meta.started_by,
                    "started_at": meta.started_at.isoformat()
                    if meta.started_at
                    else None,
                }
                for meta in SIM_STATES.values()
            ]

        await self.send_json({
            "type": "monitor_snapshot",
            "simulations": sims,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })

    async def disconnect(self, close_code):
        print("[SimMonitor] disconnect(), code=", close_code)
        await self.channel_layer.group_discard("simulation_monitor", self.channel_name)

    async def simulation_state(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def send_json(self, payload: dict):
        await self.send(text_data=json.dumps(payload, default=str))
