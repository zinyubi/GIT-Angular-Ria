import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Role, Screen, RoleScreenAccess, TWCCUser

def populate_data():
    # --- Define Roles ---
    roles_data = [
        {"name": "Inventory Manager", "description": "Inventory Manager"},
        {"name": "Aircraft Planner", "description": "Aircraft Planner"},
        {"name": "Igla Control Officer", "description": "Igla Control Officer"},
        {"name": "Pechora/OSA", "description": "Pechora/OSA"},
        {"name": "C2", "description": "C2"},
    ]

    role_objs = {}
    for role in roles_data:
        obj, _ = Role.objects.get_or_create(name=role["name"], defaults={"description": role["description"]})
        role_objs[role["name"]] = obj

    # --- Define Screens ---
    screens_data = [
        {"name": "User Management", "description": "User Management"},
        {"name": "Inventory Manager", "description": "Inventory Manager"},
        {"name": "Planner", "description": "Planner"},
        {"name": "Combat Flight Display", "description": "Combat Flight Display"},
        {"name": "ICC Display", "description": "ICC Display"},
        {"name": "Secondary", "description": "Secondary"},
        {"name": "Primary", "description": "Primary"},
    ]

    screen_objs = {}
    for screen in screens_data:
        obj, _ = Screen.objects.get_or_create(name=screen["name"], defaults={"description": screen["description"]})
        screen_objs[screen["name"]] = obj

    # --- Define Role-Screen Accesses ---
    role_screen_map = {
        "C2": ["User Management", "Inventory Manager", "Planner", "Secondary", "Primary"],
        "Pechora/OSA": ["Planner", "Combat Flight Display", "ICC Display", "Primary"],
        "Inventory Manager": ["Inventory Manager"],
        "Aircraft Planner": ["Planner"],
        "Igla Control Officer": ["Planner", "ICC Display"],
    }

    for role_name, screens in role_screen_map.items():
        role = role_objs[role_name]
        for screen_name in screens:
            screen = screen_objs[screen_name]
            RoleScreenAccess.objects.get_or_create(role=role, screen=screen)

    print("Roles, Screens, and RoleScreenAccess populated successfully.")

    # --- Create Users ---
    users_data = [
        ("user1", ["C2"]),
        ("user2", ["Inventory Manager"]),
        ("user3", ["Aircraft Planner"]),
        ("user4", ["Igla Control Officer"]),
        ("user5", ["Pechora/OSA"]),
        ("user6", ["C2", "Inventory Manager"]),
        ("user7", ["Aircraft Planner", "Igla Control Officer"]),
        ("user8", ["C2", "Pechora/OSA"]),
        ("user9", ["Inventory Manager", "Aircraft Planner"]),
        ("user10", ["C2", "Igla Control Officer"]),
    ]

    for username, assigned_roles in users_data:
        user, created = TWCCUser.objects.get_or_create(
            username=username,
            defaults={"email": f"{username}@example.com"}
        )
        if created:
            user.set_password("admin")  # Set default password
            user.save()
        user.roles.set([role_objs[role_name] for role_name in assigned_roles])
        print(f"User '{username}' created/updated with roles: {', '.join(assigned_roles)}")

    print("All users created and assigned roles successfully.")

if __name__ == "__main__":
    populate_data()
