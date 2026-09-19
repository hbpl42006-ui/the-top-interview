from django.contrib import admin
from .models import Advertisement

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ("name", "placement", "isActive", "startDate", "endDate", "impressions", "clicks")
    list_filter = ("placement", "isActive")
    search_fields = ("name", "creativeUrl", "targetUrl")
    ordering = ("-createdAt",)
    readonly_fields = ("id", "createdAt")
