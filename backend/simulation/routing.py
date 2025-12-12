# simulation/routing.py
from django.urls import re_path
from .consumers import SimulationConsumer, SimulationMonitorConsumer

websocket_urlpatterns = [
    # Per-scenario simulation stream:
    # ws://127.0.0.1:8000/ws/simulation/<scenario_id>/
    re_path(r"ws/simulation/(?P<scenario_id>\d+)/$", SimulationConsumer.as_asgi()),

    # Global monitor for all simulations (optional dashboard):
    # ws://127.0.0.1:8000/ws/simulations/monitor/
    re_path(r"ws/simulations/monitor/$", SimulationMonitorConsumer.as_asgi()),
]
