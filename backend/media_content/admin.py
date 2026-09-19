from urllib.parse import urlparse

from django import forms
from django.contrib import admin
from django.utils.html import format_html

from core.cloudinary_uploads import upload_image_asset
from .models import Guest, Interview, Podcast, PodcastEpisode, Video


class InterviewAdminForm(forms.ModelForm):
    thumbnail_upload = forms.FileField(
        label="Upload Thumbnail",
        required=False,
        help_text="Upload JPG, JPEG, PNG or WEBP. Maximum size: 5 MB.",
    )

    class Meta:
        model = Interview
        fields = "__all__"
        labels = {"thumbnail": "Existing / External Thumbnail URL"}

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("thumbnail_upload"):
            uploaded = cleaned_data["thumbnail_upload"]
            if (uploaded.content_type or "").lower() == "video/mp4":
                raise forms.ValidationError("Interview thumbnails must be images, not videos.")
            cleaned_data["thumbnail"] = upload_image_asset(uploaded, "interviews")
        return cleaned_data

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "category", "createdAt")
    search_fields = ("name", "slug", "designation", "category")
    ordering = ("name",)
    readonly_fields = ("id", "createdAt")

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    form = InterviewAdminForm
    list_display = ("topic", "status", "guest", "reporter", "publishedAt")
    list_filter = ("status", "category")
    search_fields = ("topic", "slug", "excerpt", "body")
    ordering = ("-publishedAt",)
    readonly_fields = ("id", "createdAt", "updatedAt", "thumbnail_preview")
    autocomplete_fields = ("guest", "reporter")
    fields = ("id", "slug", "topic", "excerpt", "body", "thumbnail_preview", "thumbnail_upload", "thumbnail", "videoUrl", "duration", "category", "status", "views", "guest", "reporter", "publishedAt", "updatedAt", "createdAt")

    @admin.display(description="Thumbnail Preview")
    def thumbnail_preview(self, obj):
        if not obj or not obj.thumbnail:
            return "No thumbnail"
        parsed = urlparse(obj.thumbnail)
        if parsed.scheme not in {"http", "https"}:
            return "Invalid thumbnail URL"
        return format_html('<img src="{}" alt="Thumbnail preview" style="max-width:320px;max-height:180px;object-fit:contain" />', obj.thumbnail)

@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "createdAt")
    search_fields = ("name", "slug")
    ordering = ("name",)
    readonly_fields = ("id", "createdAt")

@admin.register(PodcastEpisode)
class PodcastEpisodeAdmin(admin.ModelAdmin):
    list_display = ("title", "episodeNumber", "status", "podcast", "featured", "publishedAt")
    list_filter = ("status", "featured", "category")
    search_fields = ("title", "slug", "guestName", "description")
    ordering = ("-publishedAt",)
    readonly_fields = ("id", "createdAt")
    autocomplete_fields = ("podcast",)

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "category", "views", "publishedAt")
    list_filter = ("status", "category")
    search_fields = ("title", "slug", "youtubeId")
    ordering = ("-publishedAt",)
    readonly_fields = ("id", "createdAt")
