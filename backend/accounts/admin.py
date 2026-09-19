from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Bookmark, Notification, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("email",)
    list_display = ("email", "name", "role", "is_staff", "is_active", "createdAt")
    list_filter = ("role", "is_staff", "is_active", "is_superuser")
    search_fields = ("email", "name")
    readonly_fields = ("id", "createdAt", "updatedAt")
    exclude = ("password",)
    fieldsets = (
        (None, {"fields": ("id", "email", "name", "image", "role")}),
        ("Access", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("createdAt", "updatedAt")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "name", "role", "password1", "password2", "is_staff", "is_active")}),
    )
    filter_horizontal = ("groups", "user_permissions")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "read", "createdAt")
    list_filter = ("read",)
    search_fields = ("title", "body", "user__email")
    ordering = ("-createdAt",)
    readonly_fields = ("id", "createdAt")
    autocomplete_fields = ("user",)


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("user", "article", "createdAt")
    search_fields = ("user__email", "article__headline", "article__slug")
    ordering = ("-createdAt",)
    readonly_fields = ("id", "createdAt")
    autocomplete_fields = ("user", "article")
