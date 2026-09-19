from urllib.parse import urlparse

from django.contrib import admin
from django.utils.html import format_html, format_html_join
from .models import ContactSubmission, NewsSubmission, NewsletterSubscriber

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "isActive", "subscribedAt")
    list_filter = ("isActive",)
    search_fields = ("email",)
    ordering = ("-subscribedAt",)
    readonly_fields = ("id", "subscribedAt")

@admin.register(NewsSubmission)
class NewsSubmissionAdmin(admin.ModelAdmin):
    list_display = ("source", "name", "location", "category", "status", "media_status", "submittedAt")
    list_filter = ("source", "status", "category")
    search_fields = ("name", "contact", "location", "category", "description")
    ordering = ("-submittedAt",)
    readonly_fields = ("id", "submittedAt", "media_preview")
    fields = ("id", "source", "name", "contact", "location", "category", "description", "mediaUrl", "media_preview", "status", "submittedAt")

    @admin.display(description="Media")
    def media_status(self, obj):
        return "Attached" if obj.mediaUrl else "None"

    @admin.display(description="Media preview")
    def media_preview(self, obj):
        if not obj or not obj.mediaUrl:
            return "No media attached"
        parsed = urlparse(obj.mediaUrl)
        if parsed.scheme not in {"http", "https"}:
            return "Invalid media URL"
        is_video = "/video/" in parsed.path or parsed.path.lower().endswith(".mp4")
        preview = format_html('<video src="{}" controls preload="metadata" style="max-width:500px;max-height:350px"></video>', obj.mediaUrl) if is_video else format_html('<img src="{}" alt="Submission media" style="max-width:350px;max-height:300px;object-fit:contain" />', obj.mediaUrl)
        link = format_html('<a href="{}" target="_blank" rel="noopener">Open media</a>', obj.mediaUrl)
        return format_html_join("<br>", ((item,) for item in (preview, link)))

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "department", "status", "submittedAt")
    list_filter = ("department", "status")
    search_fields = ("name", "email", "department", "message")
    ordering = ("-submittedAt",)
    readonly_fields = ("id", "submittedAt")
