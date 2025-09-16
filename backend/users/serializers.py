from rest_framework import serializers
from .models import Message, Role, TWCCUser, Screen
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample

# -----------------------------------------------------------------------------
# Role Serializer
# -----------------------------------------------------------------------------

class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Role model.

    Fields:
        - id: Integer, primary key.
        - name: Name of the role.
        - description: Role description.
    """

    class Meta:
        model = Role
        fields = ["id", "name", "description"]


# -----------------------------------------------------------------------------
# Screen Serializer
# -----------------------------------------------------------------------------

class ScreenSerializer(serializers.ModelSerializer):
    """
    Serializer for the Screen model.

    Fields:
        - id: Integer, primary key.
        - name: Name of the screen.
        - description: Screen description.
    """

    class Meta:
        model = Screen
        fields = ["id", "name", "description"]

class UserScreensResponseSerializer(serializers.Serializer):
    roles = RoleSerializer(many=True)
    screens = ScreenSerializer(many=True)



# -----------------------------------------------------------------------------
# Basic User Serializer (for nested display)
# -----------------------------------------------------------------------------

class BasicUserSerializer(serializers.ModelSerializer):
    """
    Lightweight user serializer used for nested relationships.

    Fields:
        - id: Integer, user ID.
        - username: Username string.
        - email: Email address.
    """

    class Meta:
        model = TWCCUser
        fields = ["id", "username", "email"]


# -----------------------------------------------------------------------------
# Full User Serializer
# -----------------------------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the TWCCUser model.

    Features:
        - Read-only nested `roles` using RoleSerializer.
        - Write-only `roles_ids` for assigning roles by primary key.
        - Write-only password field.

    Fields:
        - id: Integer, user ID.
        - username: Username string.
        - email: Email address.
        - roles: List of Role objects (read-only).
        - roles_ids: List of Role IDs (write-only).
        - password: Password string (write-only).
    """

    roles = RoleSerializer(many=True, read_only=True)
    roles_ids = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        many=True,
        write_only=True,
        source="roles",
        help_text="List of role IDs to assign to the user."
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Password for the user account."
    )

    class Meta:
        model = TWCCUser
        fields = ("id", "username", "email", "roles", "roles_ids", "password")
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": False, "allow_blank": True},
        }

    def create(self, validated_data):
        """
        Create a new user, set password, assign roles.

        Args:
            validated_data (dict): Validated data from the request.

        Returns:
            TWCCUser: Created user instance.
        """
        roles = validated_data.pop("roles", [])
        password = validated_data.pop("password")
        user = TWCCUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        if roles:
            user.roles.set(roles)
        return user

    def update(self, instance, validated_data):
        """
        Update existing user, including password and roles.

        Args:
            instance (TWCCUser): Existing user instance.
            validated_data (dict): Validated data from request.

        Returns:
            TWCCUser: Updated user instance.
        """
        roles = validated_data.pop("roles", None)
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if roles is not None:
            instance.roles.set(roles)

        return instance


# -----------------------------------------------------------------------------
# Message Serializer with Spectacular Support
# -----------------------------------------------------------------------------

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            name="Message Example",
            value={
                "id": 1,
                "user": {
                    "id": 2,
                    "username": "alice",
                    "email": "alice@example.com"
                },
                "content": "Hello, world!",
                "timestamp": "2025-09-15T10:00:00Z",
                "visibility": "public",
                "visible_roles": [
                    {"id": 1, "name": "Admin", "description": "Admin role"}
                ],
                "visible_users": [
                    {"id": 3, "username": "bob", "email": "bob@example.com"}
                ]
            },
            description="A sample message object"
        )
    ]
)
class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Message model.

    Nested read-only fields:
        - user: Basic user details.
        - visible_roles: List of Role objects.
        - visible_users: List of User objects.

    Fields:
        - id: Integer, message ID.
        - user: BasicUserSerializer (read-only).
        - content: Text of the message.
        - timestamp: When message was created.
        - visibility: Visibility level.
        - visible_roles: Roles that can view this message.
        - visible_users: Users that can view this message.
    """

    user = BasicUserSerializer(read_only=True)
    visible_roles = RoleSerializer(many=True, read_only=True)
    visible_users = BasicUserSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "user",
            "content",
            "timestamp",
            "visibility",
            "visible_roles",
            "visible_users"
        ]
