from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


# ----------- Scenario -------------

class Scenario(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="scenarios")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ----------- Aircraft -------------

class AircraftType(models.Model):
    """
    Static aircraft information (type-level).
    """
    name = models.CharField(max_length=64, unique=True)
    model = models.CharField(max_length=64)
    color = models.CharField(max_length=32, default="blue")
    max_speed_mps = models.FloatField(default=200, help_text="Max speed in meters per second")
    length_m = models.FloatField(null=True, blank=True)
    wingspan_m = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name


class DeployedAircraft(models.Model):
    """
    Aircraft deployed in a scenario with dynamic state for simulation.
    """
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('moving', 'Moving'),
        ('paused', 'Paused'),
        ('arrived', 'Arrived'),
        ('stopped', 'Stopped'),
    ]

    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE, related_name="deployed_aircraft")
    aircraft_type = models.ForeignKey(AircraftType, on_delete=models.PROTECT)
    name = models.CharField(max_length=128, blank=True, default="")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='waiting', db_index=True)

    # Starting position & orientation for simulation
    initial_latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    initial_longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    initial_altitude_m = models.FloatField(default=0.0, help_text="Altitude in meters")

    # Planned waypoints: List of dicts like [{"lat": ..., "lon": ..., "alt": ...}, ...]
    planned_waypoints = models.JSONField(default=list, blank=True, help_text="Planned waypoints with lat/lon/alt")

    # Simulation state fields — updated during simulation
    current_latitude = models.FloatField(null=True, blank=True)
    current_longitude = models.FloatField(null=True, blank=True)
    current_altitude_m = models.FloatField(null=True, blank=True)

    ground_speed_mps = models.FloatField(null=True, blank=True, help_text="Current ground speed in meters/second")
    heading_deg = models.FloatField(null=True, blank=True, help_text="Current heading in degrees (0-360)")

    vertical_rate_mps = models.FloatField(null=True, blank=True, help_text="Vertical speed meters/second")
    rate_of_turn_deg_per_sec = models.FloatField(null=True, blank=True)

    last_updated = models.DateTimeField(null=True, blank=True)

    # Link deployed radar asset currently tracking or related (optional)
    radar_asset = models.ForeignKey('AssetDeployment', on_delete=models.SET_NULL, null=True, blank=True,
                                    limit_choices_to={'category': AssetDeployment.CATEGORY_RADAR},
                                    related_name='tracked_aircraft')

    external_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['scenario', 'status']),
            models.Index(fields=['current_latitude', 'current_longitude']),
        ]

    def __str__(self):
        return f"{self.name or self.aircraft_type.name} ({self.scenario.name})"

    @property
    def position(self):
        """
        Return current position as a dict {lat, lon, alt}.
        """
        return {
            "latitude": self.current_latitude or self.initial_latitude,
            "longitude": self.current_longitude or self.initial_longitude,
            "altitude_m": self.current_altitude_m or self.initial_altitude_m,
        }


# ----------- Missile Type -------------

class MissileType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    max_speed_mps = models.FloatField()
    max_range_km = models.FloatField()
    seeker_type = models.CharField(max_length=50)
    warhead_type = models.CharField(max_length=50)
    weight_kg = models.FloatField()
    length_m = models.FloatField()
    diameter_m = models.FloatField()
    rotation_speed_rpm = models.FloatField(default=30.0)
    detection_angle_deg = models.FloatField(default=60.0)
    detection_range_km = models.FloatField(default=25.0)

    def __str__(self):
        return self.name


# ----------- Radar Type -------------

class RadarType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    frequency_ghz = models.FloatField(help_text="Radar frequency in GHz")
    max_range_km = models.FloatField(help_text="Maximum detection range in km")
    azimuth_coverage_deg = models.FloatField(help_text="Azimuth coverage in degrees (e.g., 360)")
    elevation_coverage_deg = models.FloatField(help_text="Elevation coverage in degrees")
    power_kw = models.FloatField(help_text="Power in kilowatts")
    rotation_speed_rpm = models.FloatField(default=30.0)
    beamwidth_deg = models.FloatField(default=45.0)

    def __str__(self):
        return self.name

    @property
    def scan_period_s(self):
        return 60.0 / self.rotation_speed_rpm if self.rotation_speed_rpm else 0


# ----------- Asset Deployment -------------

class AssetDeployment(models.Model):
    CATEGORY_RADAR = "Radar"
    CATEGORY_MISSILE = "Missile"

    CATEGORY_CHOICES = [
        (CATEGORY_RADAR, "Radar"),
        (CATEGORY_MISSILE, "Missile"),
    ]

    external_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=128, db_index=True)
    category = models.CharField(max_length=16, choices=CATEGORY_CHOICES, db_index=True)
    sub_category = models.CharField(max_length=64, blank=True)

    # Link to type
    radar_type = models.ForeignKey(RadarType, null=True, blank=True, on_delete=models.SET_NULL, related_name='deployments')
    missile_type = models.ForeignKey(MissileType, null=True, blank=True, on_delete=models.SET_NULL, related_name='deployments')

    # Deployment location and metadata
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    elevation_m = models.FloatField(null=True, blank=True, help_text="Site elevation meters AMSL")
    site_name = models.CharField(max_length=128, blank=True)
    deployment_zone = models.CharField(max_length=128, blank=True)
    status = models.CharField(max_length=32, default="Active", db_index=True)
    deployment_date = models.DateField(null=True, blank=True)

    # Operational codes for radar
    radar_code = models.CharField(max_length=64, blank=True, null=True,
                                  help_text="Operational code/id for this radar deployment")
    sac = models.CharField(max_length=4, blank=True, null=True, help_text="System Area Code")
    sic = models.CharField(max_length=4, blank=True, null=True, help_text="System Identification Code")

    azimuth_offset_deg = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(360)])
    elevation_offset_deg = models.FloatField(null=True, blank=True)

    min_range_override_km = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0)])
    max_range_override_km = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0)])
    rotation_speed_override_rpm = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0)])

    is_mobile = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    # Access Control Lists: who can access this deployment
    roles = models.ManyToManyField('communications.Role', related_name='asset_deployments', blank=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='asset_deployments', blank=True)

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_asset_deployments')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='updated_asset_deployments')

    class Meta:
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['site_name']),
            models.Index(fields=['deployment_zone']),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(category= CATEGORY_RADAR, radar_type__isnull=False) | models.Q(category=CATEGORY_MISSILE, missile_type__isnull=False),
                                   name='category_type_match')
        ]

    def __str__(self):
        return f"{self.name} ({self.category})"

