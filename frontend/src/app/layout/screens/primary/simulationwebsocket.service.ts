// src/app/views/primary/simulationwebsocket.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { WS_URLS } from '../../../config/api.config';
import { AuthService } from '../../../core/auth/services/auth.service';

export type SimulationAction = 'start' | 'pause' | 'stop' | 'reset';

export interface SimulationAircraft {
  external_id: string;
  name: string;
  status_db: string | null;
  position_db: any | null;
  sim_status: string;
  sim_position: {
    latitude: number;
    longitude: number;
    altitude_m: number;
  } | null;
  ground_speed_mps: number | null;
  heading_deg: number | null;
  last_updated_db: string | null;
}

export interface SimulationSnapshot {
  type: 'snapshot';
  scenario_id: number;
  scenario_name: string;
  state: string;
  timestamp: string;
  aircraft_count: number;
  aircraft: SimulationAircraft[];
}

export interface SimulationInfoMessage {
  type: 'info';
  message: string;
  scenario_id: number;
  scenario_name: string;
  sim_state: string;
  can_control: boolean;
  available_actions: string[];
  initial_snapshot?: SimulationSnapshot;
}

export interface SimulationControlAck {
  type: 'control_ack';
  scenario_id: number;
  action: SimulationAction;
  state: string;
  by_user: string | null;
  timestamp: string;
  snapshot?: SimulationSnapshot | null;
}

type SimulationIncoming =
  | SimulationInfoMessage
  | SimulationSnapshot
  | SimulationControlAck
  | { type: 'error'; error: string }
  | any;

@Injectable({
  providedIn: 'root',
})
export class SimulationWebsocketService {
  private socket?: WebSocket;
  private currentScenarioId?: number | string;

  private infoSubject = new BehaviorSubject<SimulationInfoMessage | null>(null);
  private snapshotSubject = new Subject<SimulationSnapshot>();
  private stateSubject = new Subject<SimulationControlAck>();
  private errorSubject = new Subject<string>();
  private connectedSubject = new BehaviorSubject<boolean>(false);

  info$: Observable<SimulationInfoMessage | null> = this.infoSubject.asObservable();
  snapshot$: Observable<SimulationSnapshot> = this.snapshotSubject.asObservable();
  state$: Observable<SimulationControlAck> = this.stateSubject.asObservable();
  errors$: Observable<string> = this.errorSubject.asObservable();
  connected$: Observable<boolean> = this.connectedSubject.asObservable();

  constructor(
    private zone: NgZone,
    private authService: AuthService,
  ) {}

  connect(scenarioId: number | string): void {
    // If already connected to this scenario, no-op
    if (this.socket && this.currentScenarioId === scenarioId) {
      return;
    }

    // Close any existing connection
    this.disconnect();

    this.currentScenarioId = scenarioId;
    const baseUrl = WS_URLS.SIMULATION(scenarioId);

    const token = this.authService.getAccessToken();
    const wsUrl = token
      ? `${baseUrl}?token=${encodeURIComponent(token)}`
      : baseUrl;

    const socket = new WebSocket(wsUrl);
    this.socket = socket;

    socket.onopen = () => {
      this.zone.run(() => {
        this.connectedSubject.next(true);
      });
    };

    socket.onclose = () => {
      this.zone.run(() => {
        this.connectedSubject.next(false);
        this.infoSubject.next(null);
        this.currentScenarioId = undefined;
      });
    };

    socket.onerror = () => {
      this.zone.run(() => {
        this.errorSubject.next('WebSocket error');
      });
    };

    socket.onmessage = (event) => {
      this.zone.run(() => {
        try {
          const data: SimulationIncoming = JSON.parse(event.data);

          switch (data.type) {
            case 'info': {
              const info = data as SimulationInfoMessage;
              this.infoSubject.next(info);
              if (info.initial_snapshot) {
                this.snapshotSubject.next(info.initial_snapshot);
              }
              break;
            }

            case 'snapshot': {
              const snap = data as SimulationSnapshot;
              this.snapshotSubject.next(snap);
              break;
            }

            case 'control_ack': {
              const ack = data as SimulationControlAck;
              this.stateSubject.next(ack);
              if (ack.snapshot) {
                this.snapshotSubject.next(ack.snapshot);
              }
              break;
            }

            case 'error': {
              const msg = (data as any).error ?? 'Unknown error';
              this.errorSubject.next(msg);
              break;
            }

            default:
              // ignore unknown types quietly
              break;
          }
        } catch {
          this.errorSubject.next('Invalid message received from server');
        }
      });
    };
  }

  disconnect(): void {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // ignore
      }
      this.socket = undefined;
      this.currentScenarioId = undefined;
    }
  }

  sendAction(action: SimulationAction): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const payload = JSON.stringify({ action });
    this.socket.send(payload);
  }
}
