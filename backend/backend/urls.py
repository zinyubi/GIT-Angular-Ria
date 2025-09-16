"""
URL configuration for the backend project with Swagger and OpenAPI documentation.

Routes are organized for:

- Admin site
- User app API endpoints under `/users/`
- JWT token auth (`/api/token/`)
- Spectacular-based API documentation (`/swagger/`, `/redoc/`, etc.)

API Documentation:

- Swagger UI:        http://localhost:8000/swagger/
- ReDoc UI:          http://localhost:8000/redoc/
- OpenAPI JSON:      http://localhost:8000/api/schema/
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

# JWT token views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# API schema and documentation views from drf-spectacular
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # Include user app endpoints (chat, auth, roles, etc.)
    path('users/', include('users.urls')),

    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Redirect root to ReDoc UI
    path('', RedirectView.as_view(url='/redoc/', permanent=False)),

    # API schema generation (OpenAPI 3)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    # Swagger UI for visual API docs
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # ReDoc UI as alternative API docs
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
