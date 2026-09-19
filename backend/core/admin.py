from django.contrib import admin
from .models import AnalyticsEvent, Category, City, SiteSetting, SocialLink, State, Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "createdAt")
    search_fields = ("name", "slug")
    ordering = ("name",)
    readonly_fields = ("id", "createdAt")

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    ordering = ("name",)
    readonly_fields = ("id",)

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "createdAt")
    search_fields = ("name", "slug")
    ordering = ("name",)
    readonly_fields = ("id", "createdAt")

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "state", "slug")
    list_filter = ("state",)
    search_fields = ("name", "slug", "state__name")
    ordering = ("state__name", "name")
    readonly_fields = ("id",)
    autocomplete_fields = ("state",)

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("key", "value")
    search_fields = ("key", "value")
    ordering = ("key",)
    readonly_fields = ("id",)

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ("platform", "url", "isActive")
    list_filter = ("isActive",)
    search_fields = ("platform", "url")
    ordering = ("platform",)
    readonly_fields = ("id",)

@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ("eventType", "path", "device", "location", "occurredAt")
    list_filter = ("eventType", "device")
    search_fields = ("eventType", "path", "location")
    ordering = ("-occurredAt",)
    readonly_fields = ("id", "occurredAt")
