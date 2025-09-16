"""
API views for the TWCC backend application.

This module provides REST API endpoints for user registration, authentication,
role and user management, chat messages, and user screen access control.

Endpoints include:
- User registration with JWT token issuance
- Chat message listing and creation
- Role and user CRUD operations via ViewSets
- Current user info retrieval
- User screen and role access listing

All protected endpoints require JWT authentication unless otherwise specified.
"""

from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiResponse,
    extend_schema_view
)

from .models import Message, Role, TWCCUser, Screen, RoleScreenAccess
from .serializers import (
    MessageSerializer, RoleSerializer, UserSerializer, ScreenSerializer , UserScreensResponseSerializer
)

# Use custom user model
TWCCUser = get_user_model()


# -----------------------------------------------------------------------------
# Chat Message List + Create View
# -----------------------------------------------------------------------------

@extend_schema(
    tags=['Chat Messages'],
    responses={200: MessageSerializer(many=True)},
)
class ChatMessageListView(APIView):
    """
    API view to retrieve or post chat messages.

    - GET: Returns a list of all messages ordered by timestamp.
    - POST: Creates a new chat message by the authenticated user.

    Requires:
        - Authentication (JWT)
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description='Retrieve all chat messages ordered by timestamp.',
        responses={200: MessageSerializer(many=True)},
    )
    def get(self, request):
        messages = Message.objects.all().order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @extend_schema(
        description='Create a new chat message for the authenticated user.',
        request=MessageSerializer,
        responses={
            201: MessageSerializer,
            400: OpenApiResponse(description="Content missing or invalid"),
        },
    )
    def post(self, request):
        content = request.data.get('content')
        if not content:
            return Response(
                {"error": "Content is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        message = Message.objects.create(user=request.user, content=content)
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# -----------------------------------------------------------------------------
# User Registration View (returns JWT tokens)
# -----------------------------------------------------------------------------

@extend_schema(
    tags=['Authentication'],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'username': {'type': 'string', 'example': 'user123'},
                'password': {'type': 'string', 'format': 'password', 'example': 'strong_password'},
            },
            'required': ['username', 'password'],
        }
    },
    responses={
        201: {
            'type': 'object',
            'properties': {
                'refresh': {'type': 'string'},
                'access': {'type': 'string'},
            },
        },
        400: OpenApiResponse(description='Validation failed'),
    },
)
@api_view(['POST'])
def register(request):
    """
    Register a new user and return JWT tokens.

    Request:
        {
            "username": "user123",
            "password": "strong_password"
        }

    Response (201):
        {
            "refresh": "<refresh_token>",
            "access": "<access_token>"
        }

    Response (400):
        {
            "error": "Username already taken" or "Missing fields"
        }

    Requires:
        - No authentication
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if TWCCUser.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already taken."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = TWCCUser.objects.create_user(username=username, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)


# -----------------------------------------------------------------------------
# Role ViewSet
# -----------------------------------------------------------------------------

@extend_schema(tags=['Roles'])
class RoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Role instances.

    - list: Get all roles
    - retrieve: Get a single role
    - create: Add a new role
    - update/partial_update: Modify a role
    - destroy: Delete a role

    Requires:
        - Authentication
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


# -----------------------------------------------------------------------------
# User ViewSet
# -----------------------------------------------------------------------------

@extend_schema(tags=['Users'])
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing User instances.

    - list: Get all users
    - retrieve: Get a single user
    - create: Add a new user
    - update/partial_update: Modify a user
    - destroy: Delete a user

    Requires:
        - Authentication
    """
    queryset = TWCCUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# -----------------------------------------------------------------------------
# Current Authenticated User Info
# -----------------------------------------------------------------------------

@extend_schema(
    tags=['Users'],
    responses={200: UserSerializer},
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Retrieve information about the current authenticated user.

    Returns:
        200 OK with UserSerializer data.

    Requires:
        - Authentication
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# -----------------------------------------------------------------------------
# Screens Accessible to Current User via Roles
# -----------------------------------------------------------------------------

# -------------------------------------------------------------------------
# Response Serializer for OpenAPI Schema
# -------------------------------------------------------------------------




@extend_schema(
    tags=['Users'],
    responses={200: UserScreensResponseSerializer},
)
class UserScreensAPIView(APIView):
    """
    Retrieve screens and roles accessible to the current user based on role assignments.

    Response:
    {
        "roles": [<Role>],
        "screens": [<Screen>]
    }

    Requires:
        - JWT Authentication
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get all roles assigned to the current user
        roles = user.roles.all()

        # Get all screen IDs accessible via those roles
        screen_ids = RoleScreenAccess.objects.filter(
            role__in=roles
        ).values_list('screen_id', flat=True)

        # Get all distinct screen objects
        screens = Screen.objects.filter(id__in=screen_ids).distinct()

        # Serialize and return response
        return Response({
            "roles": RoleSerializer(roles, many=True).data,
            "screens": ScreenSerializer(screens, many=True).data,
        })