from django.db import models
from django.contrib.auth.models import AbstractUser,  Group, Permission

class Role(models.Model):
    """
    Represents a user role. Name must be unique.
    """
    name = models.CharField(max_length=64, unique=True, help_text="Role display name, e.g. 'C2', 'Radar Operator'")
    description = models.TextField(blank=True, help_text="Optional description for this role")

    def __str__(self) -> str:
        return self.name

from django.db import models

class Screen(models.Model):
    """
    Represents an application screen or dashboard.
    """
    name = models.CharField(
        max_length=64,
        unique=True,
        help_text="Screen display name, e.g., 'Primary', 'Secondary', 'ICC Display'"
    )
    description = models.TextField(
        blank=True,
        help_text="Optional description for this screen."
    )
    path = models.CharField(
        max_length=64,
        # unique=False,   # Set to True only if all paths must be unique
        # null=True,
        # blank=True,
        help_text="Frontend route path, e.g., 'primary', 'secondary', 'usermanagement'."
    )
    roles = models.ManyToManyField(
        'Role',  # Use string if Role is defined below or in another file
        related_name="screens",
        blank=True
    )

    def __str__(self):
        return self.name

class Functionality(models.Model):
    """
    Represents a feature/functionality available in the platform.
    """
    name = models.CharField(max_length=128, unique=True, help_text="Unique name of the functionality")
    description = models.TextField(blank=True)
    screens = models.ManyToManyField(Screen, related_name="functionalities", blank=True)

    def __str__(self) -> str:
        return self.name

class RoleScreenAccess(models.Model):
    """
    Explicit mapping table defining which role can see which screen.
    """
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("role", "screen")
        verbose_name = "Role-Screen Access"
        verbose_name_plural = "Role-Screen Accesses"

    def __str__(self) -> str:
        return f"{self.role.name} - {self.screen.name}"

class TWCCUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='twccuser_set',  # Unique reverse accessor
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='twccuser_set',  # Unique reverse accessor
        blank=True
    )
    roles = models.ManyToManyField(Role, related_name='users', blank=True)


class Message(models.Model):
    """
    Example messaging model supporting visibility by roles or users.
    """
    VISIBILITY_CHOICES = [
        ('ALL', 'All Users'),
        ('GROUP', 'Group of Users'),
        ('ROLES', 'Specific Roles'),
    ]
    user = models.ForeignKey(TWCCUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='ALL')
    visible_roles = models.ManyToManyField(Role, blank=True, related_name='visible_messages')
    visible_users = models.ManyToManyField(TWCCUser, blank=True, related_name='private_messages')

    def __str__(self) -> str:
        return f"{self.user.username} - {self.content[:20]}"