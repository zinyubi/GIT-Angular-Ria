"""
Serializers for the Simulation backend application.

This module defines serializers for entities like Scenarios,
Deployed Aircraft, Aircraft Types, Missile Types, Radars, and Assets.

Each serializer defines how data is serialized and deserialized for API use.
"""

from rest_framework import serializers
from .models import (
    Scenario,
    AircraftType,
    DeployedAircraft,
    MissileType,
    RadarType,
    AssetDeployment,
)


# -------------- Basic Serializers ------------------


class ScenarioSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Scenario
        fields = ["id", "name", "description", "created_by", "created_at"]
        read_only_fields = ["id", "created_at"]


class AircraftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AircraftType
        fields = [
            'id', 'name', 'model', 'color', 'max_speed_mps',
            'length_m', 'wingspan_m',
        ]


class MissileTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissileType
        fields = [
            'id', 'name', 'description', 'max_speed_mps', 'max_range_km',
            'seeker_type', 'warhead_type', 'weight_kg', 'length_m',
            'diameter_m', 'rotation_speed_rpm', 'detection_angle_deg', 'detection_range_km',
        ]


class RadarTypeSerializer(serializers.ModelSerializer):
    scan_period_s = serializers.FloatField(read_only=True)

    class Meta:
        model = RadarType
        fields = [
            'id', 'name', 'description', 'frequency_ghz', 'max_range_km',
            'azimuth_coverage_deg', 'elevation_coverage_deg', 'power_kw',
            'rotation_speed_rpm', 'beamwidth_deg', 'scan_period_s',
        ]


class AssetDeploymentSerializer(serializers.ModelSerializer):
    radar_type = RadarTypeSerializer(read_only=True)
    missile_type = MissileTypeSerializer(read_only=True)

    class Meta:
        model = AssetDeployment
        fields = [
            'external_id', 'name', 'category', 'sub_category', 'radar_type',
            'missile_type', 'latitude', 'longitude', 'elevation_m', 'site_name',
            'deployment_zone', 'status', 'deployment_date', 'radar_code',
            'sac', 'sic', 'azimuth_offset_deg', 'elevation_offset_deg',
            'min_range_override_km', 'max_range_override_km', 'rotation_speed_override_rpm',
            'is_mobile', 'notes',
        ]


# -------------- Deployed Aircraft ------------------
class PositionSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    altitude_m = serializers.FloatField()


class VelocitySerializer(serializers.Serializer):
    ground_speed_mps = serializers.FloatField(allow_null=True)
    heading_deg = serializers.FloatField(allow_null=True)
    vertical_rate_mps = serializers.FloatField(allow_null=True)
    rate_of_turn_deg_per_sec = serializers.FloatField(allow_null=True)


class DeployedAircraftListSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for list/retrieve:
    - Nested aircraft_type
    - Position + velocity fields derived from model fields
    """

    position = serializers.SerializerMethodField()
    velocity = serializers.SerializerMethodField()
    aircraft_type = AircraftTypeSerializer(read_only=True)
    radar_asset = AssetDeploymentSerializer(read_only=True)

    class Meta:
        model = DeployedAircraft
        fields = [
            "id",
            "external_id",
            "name",
            "status",
            "scenario",
            "aircraft_type",
            "position",
            "velocity",
            "last_updated",
            "planned_waypoints",
            "radar_asset",
        ]

    def get_position(self, obj):
        # Fall back to initial_* if current_* is null
        return {
            "latitude": (
                obj.current_latitude
                if obj.current_latitude is not None
                else obj.initial_latitude
            ),
            "longitude": (
                obj.current_longitude
                if obj.current_longitude is not None
                else obj.initial_longitude
            ),
            "altitude_m": (
                obj.current_altitude_m
                if obj.current_altitude_m is not None
                else obj.initial_altitude_m
            ),
        }

    def get_velocity(self, obj):
        return {
            "ground_speed_mps": obj.ground_speed_mps,
            "heading_deg": obj.heading_deg,
            "vertical_rate_mps": obj.vertical_rate_mps,
            "rate_of_turn_deg_per_sec": obj.rate_of_turn_deg_per_sec,
        }


class DeployedAircraftCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for create/update:
    - Uses scenario (id), aircraft_type (id)
    - Accepts initial_* and planned_waypoints from the client
    """

    class Meta:
        model = DeployedAircraft
        fields = [
            "id",
            "name",
            "scenario",
            "aircraft_type",
            "initial_latitude",
            "initial_longitude",
            "initial_altitude_m",
            "planned_waypoints",
        ]