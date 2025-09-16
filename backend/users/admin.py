from django.contrib import admin
from django import forms
from .models import TWCCUser, Role, Screen, RoleScreenAccess, Message, Functionality

class RoleScreenMultipleChoiceForm(forms.ModelForm):
    """
    Custom ModelForm for Role admin to manage many-to-many relationship
    with Screen objects through a user-friendly multiple select widget.

    This form replaces the standard widget for screens with a filtered
    select multiple widget and synchronizes the RoleScreenAccess join model
    on save.
    """
    screens = forms.ModelMultipleChoiceField(
        queryset=Screen.objects.all(),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple("Screens", is_stacked=False)
    )

    class Meta:
        model = Role
        fields = ["name", "description"]

    def __init__(self, *args, **kwargs):
        """
        Initialize the form.

        Pre-populates the 'screens' field with screens associated with
        the Role instance, if editing an existing Role.
        """
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields["screens"].initial = Screen.objects.filter(roles=self.instance)

    def save(self, commit=True):
        """
        Override save method to update RoleScreenAccess join table based
        on selected screens.

        Removes unselected screens and creates new RoleScreenAccess records
        as necessary.

        Args:
            commit (bool): Whether to commit changes to the database.

        Returns:
            Role instance saved.
        """
        role = super().save(commit=commit)
        if role.pk:
            screens = self.cleaned_data["screens"]
            # Remove RoleScreenAccess records for screens not selected
            RoleScreenAccess.objects.filter(role=role).exclude(screen__in=screens).delete()
            # Add RoleScreenAccess records for newly selected screens
            for screen in screens:
                RoleScreenAccess.objects.get_or_create(role=role, screen=screen)
        return role


class RoleScreenAccessInline(admin.TabularInline):
    """
    Inline admin descriptor for RoleScreenAccess model.

    Allows editing RoleScreenAccess records inline on the Role or Screen admin page.
    """
    model = RoleScreenAccess
    extra = 1


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    """
    Admin configuration for Role model.

    Displays role name and description, provides search,
    and manages RoleScreenAccess inline records using a custom form.
    """
    form = RoleScreenMultipleChoiceForm
    list_display = ("name", "description")
    search_fields = ("name",)
    inlines = [RoleScreenAccessInline]

    def get_form(self, request, obj=None, **kwargs):
        """
        Returns the form to be used in the admin interface.

        Args:
            request: The current HttpRequest object.
            obj: The Role instance being edited (or None if creating).
            kwargs: Additional arguments.

        Returns:
            Form class to use.
        """
        form = super().get_form(request, obj, **kwargs)
        return form


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


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    """
    Admin configuration for Screen model.

    Displays name and description, allows search,
    and includes RoleScreenAccess inline for managing role associations.
    """
    list_display = ("name", "description")
    search_fields = ("name",)
    inlines = [RoleScreenAccessInline]


@admin.register(Functionality)
class FunctionalityAdmin(admin.ModelAdmin):
    """
    Admin configuration for Functionality model.

    Displays name and description, search enabled,
    with horizontal filter widget for associated screens.
    """
    list_display = ("name", "description")
    search_fields = ("name",)
    filter_horizontal = ("screens",)


@admin.register(RoleScreenAccess)
class RoleScreenAccessAdmin(admin.ModelAdmin):
    """
    Admin configuration for RoleScreenAccess join model.

    Displays role and screen with filtering options.
    """
    list_display = ("role", "screen")
    list_filter = ("role", "screen")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """
    Admin configuration for Message model.

    Displays user, content, timestamp, and visibility status.
    Enables search by user username and message content.
    Provides filter horizontal widgets for visible_roles and visible_users.
    """
    list_display = ("user", "content", "timestamp", "visibility")
    search_fields = ("user__username", "content")
    filter_horizontal = ("visible_roles", "visible_users")
