import os
import re

from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import User, UserRole
from core.models import Category, City, State


CATEGORIES = (
    "Ground Reports", "Breaking News", "Local News", "National News", "Interviews",
    "Special Reports", "Public Issues", "Politics", "Education", "Technology",
    "Business", "Entertainment", "Sports", "Crime & Safety", "Social Issues",
    "Trending Stories",
)
STATES = {
    "uttar-pradesh": ("Uttar Pradesh", ("Lucknow", "Kanpur", "Varanasi", "Kushinagar", "Noida", "Prayagraj")),
    "bihar": ("Bihar", ("Patna", "Gaya", "Muzaffarpur", "Darbhanga")),
    "delhi": ("Delhi", ("New Delhi", "Dwarka", "Rohini", "Karol Bagh")),
    "madhya-pradesh": ("Madhya Pradesh", ("Bhopal", "Indore", "Gwalior", "Jabalpur")),
    "rajasthan": ("Rajasthan", ("Jaipur", "Jodhpur", "Udaipur", "Bikaner")),
    "maharashtra": ("Maharashtra", ("Mumbai", "Pune", "Nagpur", "Nashik")),
    "other-states": ("Other States", ("Chandigarh", "Ahmedabad", "Kolkata", "Bengaluru")),
}


def slugify(value):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9\s-]", "", value.lower().strip()).replace(" ", "-")).strip("-")


class Command(BaseCommand):
    help = "Create idempotent Django bootstrap data. Demo content is intentionally excluded."

    @transaction.atomic
    def handle(self, *args, **options):
        for name in CATEGORIES:
            Category.objects.update_or_create(slug=slugify(name), defaults={"name": name})

        for slug, (name, cities) in STATES.items():
            state, _ = State.objects.update_or_create(slug=slug, defaults={"name": name})
            for city_name in cities:
                City.objects.update_or_create(
                    state=state,
                    name=city_name,
                    defaults={"slug": slugify(f"{city_name}-{slug}")},
                )

        email = os.getenv("SEED_ADMIN_EMAIL")
        password = os.getenv("SEED_ADMIN_PASSWORD")
        if email and password:
            admin, _ = User.objects.get_or_create(email=email, defaults={"name": "Admin Desk"})
            admin.name = admin.name or "Admin Desk"
            admin.role = UserRole.SUPER_ADMIN
            admin.is_staff = True
            admin.is_superuser = True
            admin.set_password(password)
            admin.save()
            self.stdout.write(f"Ensured SUPER_ADMIN account: {email}")
        else:
            self.stdout.write("Skipped admin account; set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one.")

        self.stdout.write(self.style.SUCCESS("Bootstrap seed complete. Demo content was not imported."))
