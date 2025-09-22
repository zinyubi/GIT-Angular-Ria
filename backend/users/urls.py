"""
URL Configuration for the users app.

This module defines all REST API endpoints related to:

- Chat messages
- User registration
- Current authenticated user info
- User role and screen access
- Role and user management via ViewSets (router)

All endpoints (except registration) require JWT authentication.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChatMessageListView,
    register,
    RoleViewSet,
    UserViewSet,
    UserScreensAPIView,
    me,
    ScreenViewSet,
)

# Initialize the router and register viewsets
router = DefaultRouter()
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'users', UserViewSet, basename='user')
router.register(r'screens', ScreenViewSet, basename='screen') 

urlpatterns = [
    # Chat message list and create
    path(
        'messages/',
        ChatMessageListView.as_view(),
        name='chat_messages'
    ),
    

    # User registration (JWT issued after registration)
    path(
        'register/',
        register,
        name='register'
    ),

    # Get current user information
    path(
        'me/',
        me,
        name='current_user'
    ),

    # Get screens and roles available to current user
    path(
        'screens/',
        UserScreensAPIView.as_view(),
        name='user_screens'
    ),

    # Include router-generated routes for /roles/ and /users/
    path('', include(router.urls)),
]


"""
## API Endpoints Summary

- `GET /users/messages/`
    - List all chat messages (auth required)

- `POST /users/messages/`
    - Post a new message as the current user

- `POST /users/register/`
    - Register a new user and receive JWT tokens

- `GET /users/me/`
    - Get current user's profile and roles

- `GET /users/screens/`
    - Get screens and roles accessible to current user

- `GET|POST|PUT|PATCH|DELETE /users/roles/`
    - Full CRUD for Role objects (auth required)

- `GET|POST|PUT|PATCH|DELETE /users/users/`
    - Full CRUD for User objects (auth required)
"""
