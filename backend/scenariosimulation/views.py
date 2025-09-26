"""
API views for the Simulation backend application.

This module provides REST API endpoints for managing simulation entities such as scenarios,
aircraft types, deployed aircraft, radars, missiles, and asset deployments.

All endpoints require authentication.
"""

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

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
    DeployedAircraftSerializer,
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
        - list: Retrieve all scenarios.
        - retrieve: Get a single scenario by ID.
        - create: Create a new scenario.
        - update / partial_update: Modify a scenario by ID.
        - destroy: Delete a scenario by ID.

    Permissions:
        Requires authentication.
    """
    queryset = Scenario.objects.all()
    serializer_class = ScenarioSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ScenarioSerializer,
        responses={
            201: ScenarioSerializer,
            400: OpenApiResponse(description="Invalid data")
        },
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# ----------------- AircraftType ---------------------

@extend_schema(tags=['AircraftTypes'])
class AircraftTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing AircraftType instances.

    Actions:
        - list, retrieve, create, update, partial_update, destroy.

    Permissions:
        Requires authentication.
    """
    queryset = AircraftType.objects.all()
    serializer_class = AircraftTypeSerializer
    permission_classes = [IsAuthenticated]


# ----------------- DeployedAircraft ---------------------

@extend_schema(tags=['DeployedAircraft'])
class DeployedAircraftViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing DeployedAircraft instances.

    Includes current position and velocity info in responses.

    Permissions:
        Requires authentication.
    """
    queryset = DeployedAircraft.objects.all()
    serializer_class = DeployedAircraftSerializer
    permission_classes = [IsAuthenticated]


# ----------------- MissileType ---------------------

@extend_schema(tags=['MissileTypes'])
class MissileTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing MissileType instances.

    Permissions:
        Requires authentication.
    """
    queryset = MissileType.objects.all()
    serializer_class = MissileTypeSerializer
    permission_classes = [IsAuthenticated]


# ----------------- RadarType ---------------------

@extend_schema(tags=['RadarTypes'])
class RadarTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing RadarType instances.

    Permissions:
        Requires authentication.
    """
    queryset = RadarType.objects.all()
    serializer_class = RadarTypeSerializer
    permission_classes = [IsAuthenticated]


# ----------------- AssetDeployment ---------------------

@extend_schema(tags=['AssetDeployments'])
class AssetDeploymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing AssetDeployment instances.

    Permissions:
        Requires authentication.
    """
    queryset = AssetDeployment.objects.all()
    serializer_class = AssetDeploymentSerializer
    permission_classes = [IsAuthenticated]
