# users/admin.py
from django.contrib import admin
from django import forms

from .models import (
    TWCCUser,
    Role,
    Screen,
    RoleScreenAccess,
    Message,
    Functionality,
)


# -------------------------------------------------------------------
# Custom ModelForm for Role: handles screens + can_control_simulation
# -------------------------------------------------------------------
class RoleScreenMultipleChoiceForm(forms.ModelForm):
    """
    Custom ModelForm for Role admin to manage:

      - Role fields (name, description, can_control_simulation)
      - Screens via a nice FilteredSelectMultiple widget

    It also keeps the RoleScreenAccess join model in sync.
    """

    # This field is NOT on the model directly; we map it manually
    screens = forms.ModelMultipleChoiceField(
        queryset=Screen.objects.all(),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple("Screens", is_stacked=False),
        help_text="Screens that this role can access.",
    )

    class Meta:
        model = Role
        # 👇 IMPORTANT: include can_control_simulation AND screens here
        fields = ["name", "description", "can_control_simulation", "screens"]

    def __init__(self, *args, **kwargs):
        """
        Pre-populate 'screens' with the screens already mapped to this role.
        """
        super().__init__(*args, **kwargs)

        if self.instance.pk:
            # Use the M2M relation from Role to Screen
            self.fields["screens"].initial = self.instance.screens.all()

    def save(self, commit=True):
        """
        Save the Role, then synchronize:

          - role.screens (M2M)
          - RoleScreenAccess join table

        based on the selected 'screens'.
        """
        role = super().save(commit=commit)

        if role.pk:
            # Selected screens in the form
            screens = self.cleaned_data.get("screens", Screen.objects.none())

            # 1) Keep Role.screens M2M in sync
            role.screens.set(screens)

            # 2) Keep RoleScreenAccess in sync (if you still want this join table)
            #    Remove mappings for unselected screens:
            RoleScreenAccess.objects.filter(role=role).exclude(screen__in=screens).delete()
            #    Add mappings for newly selected screens:
            for screen in screens:
                RoleScreenAccess.objects.get_or_create(role=role, screen=screen)

        return role


# -------------------------------------------------------------------
# Inlines
# -------------------------------------------------------------------
class RoleScreenAccessInline(admin.TabularInline):
    """
    Inline admin for RoleScreenAccess model.
    """
    model = RoleScreenAccess
    extra = 1


# -------------------------------------------------------------------
# Role admin
# -------------------------------------------------------------------
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    """
    Admin configuration for Role model.

    - Shows name, description and can_control_simulation flag
    - Uses custom form with FilteredSelectMultiple for screens
    - Optionally shows RoleScreenAccess inline
    """
    form = RoleScreenMultipleChoiceForm

    list_display = ("name", "description", "can_control_simulation")
    search_fields = ("name", "description")
    list_filter = ("can_control_simulation",)

    inlines = [RoleScreenAccessInline]


# -------------------------------------------------------------------
# TWCCUser admin
# -------------------------------------------------------------------
@admin.register(TWCCUser)
class TWCCUserAdmin(admin.ModelAdmin):
    """
    Admin configuration for TWCCUser model.

    Provides list display for username and email, search capabilities,
    and horizontal filter widget for role assignments.
    """
    list_display = ("username", "email")
    search_fields = ("username", "email")
    filter_horizontal = ("roles",)


# -------------------------------------------------------------------
# Screen admin
# -------------------------------------------------------------------
@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    """
    Admin configuration for Screen model.
    """
    list_display = ("name", "description", "path")
    search_fields = ("name", "description", "path")
    inlines = [RoleScreenAccessInline]


# -------------------------------------------------------------------
# Functionality admin
# -------------------------------------------------------------------
@admin.register(Functionality)
class FunctionalityAdmin(admin.ModelAdmin):
    """
    Admin configuration for Functionality model.
    """
    list_display = ("name", "description")
    search_fields = ("name", "description")
    filter_horizontal = ("screens",)


# -------------------------------------------------------------------
# RoleScreenAccess admin
# -------------------------------------------------------------------
@admin.register(RoleScreenAccess)
class RoleScreenAccessAdmin(admin.ModelAdmin):
    """
    Admin configuration for RoleScreenAccess join model.
    """
    list_display = ("role", "screen")
    list_filter = ("role", "screen")


# -------------------------------------------------------------------
# Message admin
# -------------------------------------------------------------------
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """
    Admin configuration for Message model.
    """
    list_display = ("user", "content", "timestamp", "visibility")
    search_fields = ("user__username", "content")
    filter_horizontal = ("visible_roles", "visible_users")
