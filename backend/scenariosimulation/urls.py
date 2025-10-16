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
router.register(r'aircrafttypes', AircraftTypeViewSet, basename='aircrafttype')
router.register(r'deployedaircrafts', DeployedAircraftViewSet, basename='deployedaircraft')
router.register(r'missiletypes', MissileTypeViewSet, basename='missiletype')
router.register(r'radartypes', RadarTypeViewSet, basename='radartype')
router.register(r'assetdeployments', AssetDeploymentViewSet, basename='assetdeployment')



urlpatterns = [
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

- `GET aircrafttypes/` - List all aircraft types
- `POST aircrafttypes/` - Create new aircraft type
- (similar CRUD for aircraft-types/{id}/)

- `GET deployedaircraft/` - List all deployed aircraft
- (similar CRUD for deployed-aircraft/{id}/)

- `GET missiletypes/` - List all missile types
- (similar CRUD for missile-types/{id}/)

- `GET radartypes/` - List all radar types
- (similar CRUD for radar-types/{id}/)

- `GET assetdeployments/` - List all asset deployments
- (similar CRUD for asset-deployments/{id}/)
"""
