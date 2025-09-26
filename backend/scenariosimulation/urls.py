"""
URL Configuration for the simulation app.

This module defines all REST API endpoints related to:

- Listing, retrieving, creating, updating, and deleting Scenarios, AircraftTypes,
  DeployedAircraft, MissileTypes, RadarTypes, and AssetDeployments.
- All endpoints require authentication (e.g., JWT or Session).
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ScenarioViewSet,
    AircraftTypeViewSet,
    DeployedAircraftViewSet,
    MissileTypeViewSet,
    RadarTypeViewSet,
    AssetDeploymentViewSet,
)

# Initialize the router and register all viewsets
router = DefaultRouter()
router.register(r'scenarios', ScenarioViewSet, basename='scenario')
router.register(r'aircraft-types', AircraftTypeViewSet, basename='aircrafttype')
router.register(r'deployed-aircraft', DeployedAircraftViewSet, basename='deployedaircraft')
router.register(r'missile-types', MissileTypeViewSet, basename='missiletype')
router.register(r'radar-types', RadarTypeViewSet, basename='radartype')
router.register(r'asset-deployments', AssetDeploymentViewSet, basename='assetdeployment')

urlpatterns = [
    # Include all router-generated routes
    path('', include(router.urls)),
]

"""
## API Endpoints Summary

- `GET scenarios/` - List all scenarios (auth required)
- `POST scenarios/` - Create a new scenario (auth required)
- `GET scenarios/{id}/` - Retrieve scenario by ID (auth required)
- `PUT scenarios/{id}/` - Update scenario by ID (auth required)
- `PATCH scenarios/{id}/` - Partial update scenario by ID (auth required)
- `DELETE scenarios/{id}/` - Delete scenario by ID (auth required)

- `GET aircraft-types/` - List all aircraft types
- `POST aircraft-types/` - Create new aircraft type
- (similar CRUD for aircraft-types/{id}/)

- `GET deployed-aircraft/` - List all deployed aircraft
- (similar CRUD for deployed-aircraft/{id}/)

- `GET missile-types/` - List all missile types
- (similar CRUD for missile-types/{id}/)

- `GET radar-types/` - List all radar types
- (similar CRUD for radar-types/{id}/)

- `GET asset-deployments/` - List all asset deployments
- (similar CRUD for asset-deployments/{id}/)
"""
