"""
API views for the Simulation backend application.

Provides REST API endpoints for managing simulation entities like:
- Scenarios
- Aircraft types
- Deployed aircraft
- Radars, Missiles, Assets

All endpoints require authentication.
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import (
    Scenario,
    AircraftType,
    DeployedAircraft,
    MissileType,
    RadarType,
    AssetDeployment,
)

from .serializers import (
    ScenarioSerializer,
    AircraftTypeSerializer,
    DeployedAircraftListSerializer,
    DeployedAircraftCreateUpdateSerializer,
    MissileTypeSerializer,
    RadarTypeSerializer,
    AssetDeploymentSerializer,
)


# ----------------- Scenario ---------------------

@extend_schema(tags=['Scenarios'])
class ScenarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Scenario instances.

    Actions:
        - list, retrieve, create, update, partial_update, destroy

    Permissions:
        Requires authentication.
    """
    queryset = Scenario.objects.all()
    serializer_class = ScenarioSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ----------------- AircraftType ---------------------

@extend_schema(tags=['AircraftTypes'])
class AircraftTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing AircraftType instances.

    Permissions:
        Requires authentication.
    """
    queryset = AircraftType.objects.all()
    serializer_class = AircraftTypeSerializer
    permission_classes = [IsAuthenticated]


# ----------------- DeployedAircraft ---------------------

@extend_schema(tags=['DeployedAircrafts'])
class DeployedAircraftViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing DeployedAircraft instances.

    - Supports listing all deployed aircrafts in a scenario
    - Supports creating and updating deployed aircraft with waypoints

    Permissions:
        Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = DeployedAircraft.objects.all()
        scenario_id = self.request.query_params.get('scenario')
        if scenario_id:
            queryset = queryset.filter(scenario_id=scenario_id)
        return queryset

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return DeployedAircraftListSerializer
        return DeployedAircraftCreateUpdateSerializer


# ----------------- MissileType ---------------------

@extend_schema(tags=['MissileTypes'])
class MissileTypeViewSet(viewsets.ModelViewSet):
    queryset = MissileType.objects.all()
    serializer_class = MissileTypeSerializer
    permission_classes = [IsAuthenticated]


# ----------------- RadarType ---------------------

@extend_schema(tags=['RadarTypes'])
class RadarTypeViewSet(viewsets.ModelViewSet):
    queryset = RadarType.objects.all()
    serializer_class = RadarTypeSerializer
    permission_classes = [IsAuthenticated]


# ----------------- AssetDeployment ---------------------

@extend_schema(tags=['AssetDeployments'])
class AssetDeploymentViewSet(viewsets.ModelViewSet):
    queryset = AssetDeployment.objects.all()
    serializer_class = AssetDeploymentSerializer
    permission_classes = [IsAuthenticated]
