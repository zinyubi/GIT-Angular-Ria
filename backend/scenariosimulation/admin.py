from django.contrib import admin
from .models import AircraftType, RadarType, MissileType, AssetDeployment, DeployedAircraft , Scenario

@admin.register(AircraftType)
class AircraftTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'model', 'max_speed_mps', 'color')

@admin.register(RadarType)
class RadarTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'frequency_ghz', 'max_range_km', 'azimuth_coverage_deg')

@admin.register(MissileType)
class MissileTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'max_speed_mps', 'max_range_km', 'seeker_type')

@admin.register(AssetDeployment)
class AssetDeploymentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'site_name', 'status', 'latitude', 'longitude')
    list_filter = ('category', 'status')

@admin.register(DeployedAircraft)
class DeployedAircraftAdmin(admin.ModelAdmin):
    list_display = ('name', 'aircraft_type', 'scenario', 'status', 'initial_latitude', 'initial_longitude')
    list_filter = ('status',)

@admin.register(Scenario)
class ScenarioAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_by')