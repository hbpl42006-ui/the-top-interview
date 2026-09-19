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
        category_count = 0
        for name in CATEGORIES:
            Category.objects.get_or_create(slug=slugify(name), defaults={"name": name})
            category_count += 1

        state_count = 0
        city_count = 0
        for slug, (name, cities) in STATES.items():
            state, _ = State.objects.get_or_create(slug=slug, defaults={"name": name})
            state_count += 1
            for city_name in cities:
                city_slug = slugify(f"{city_name}-{slug}")
                City.objects.get_or_create(
                    state=state, slug=city_slug,
                    defaults={"name": city_name},
                )
                city_count += 1

        email = os.getenv("SEED_ADMIN_EMAIL")
        password = os.getenv("SEED_ADMIN_PASSWORD")
        if email and password:
            admin, created = User.objects.get_or_create(
                email=email,
                defaults={"name": "Admin Desk", "role": UserRole.SUPER_ADMIN, "is_staff": True, "is_superuser": True},
            )
            if created:
                admin.set_password(password)
                admin.save(update_fields=["password"])
                admin_status = "created"
            else:
                admin_status = "already exists"
            self.stdout.write(f"SUPER_ADMIN: {admin_status}")
        else:
            self.stdout.write(self.style.WARNING("SUPER_ADMIN: skipped (seed credentials not configured)."))

        self.stdout.write(f"Categories: {category_count} processed")
        self.stdout.write(f"States: {state_count} processed")
        self.stdout.write(f"Cities: {city_count} processed")
        self.stdout.write(self.style.SUCCESS("Bootstrap seed complete. Demo content was not imported."))
