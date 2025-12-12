from django.db import models

class Location(models.Model):
    lat = models.FloatField()
    lon = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lat}, {self.lon} @ {self.timestamp}"
