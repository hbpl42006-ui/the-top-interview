from urllib.parse import urlparse

from django import forms
from django.contrib import admin
from django.utils.html import format_html, format_html_join

from core.cloudinary_uploads import upload_image_asset, upload_video_asset
from .models import Comment, GroundReport, NewsArticle, Reporter, SpecialReport, TeamMember


class GroundReportAdminForm(forms.ModelForm):
    image_upload = forms.FileField(label="Upload Image", required=False, help_text="JPG, JPEG, PNG or WEBP. Maximum size: 5 MB.")
    video_upload = forms.FileField(label="Upload Video", required=False, help_text="MP4 only. Maximum size: 20 MB.")

    class Meta:
        model = GroundReport
        fields = "__all__"
        labels = {"image": "Existing / External Image URL", "videoUrl": "Existing / External Video URL"}

    def clean(self):
        cleaned_data = super().clean()
        image = cleaned_data.get("image_upload")
        video = cleaned_data.get("video_upload")
        if image:
            cleaned_data["image"] = upload_image_asset(image, "ground-reports/images")
        if video:
            cleaned_data["videoUrl"] = upload_video_asset(video, "ground-reports/videos")
        return cleaned_data

class ContentAdmin(admin.ModelAdmin):
    list_filter = ("status", "publishedAt")
    search_fields = ("headline", "title", "slug")
    ordering = ("-publishedAt",)
    readonly_fields = ("id", "createdAt", "updatedAt")
    autocomplete_fields = ("category", "city", "reporter")

@admin.register(Reporter)
class ReporterAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "email", "location", "createdAt")
    search_fields = ("name", "slug", "designation", "email")
    list_filter = ("location__state",)
    ordering = ("name",)
    readonly_fields = ("id", "createdAt", "updatedAt")
    autocomplete_fields = ("user", "location")

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "isActive", "displayOrder")
    list_filter = ("isActive",)
    search_fields = ("name", "designation")
    ordering = ("displayOrder", "name")
    readonly_fields = ("id", "createdAt", "updatedAt")

@admin.register(NewsArticle)
class NewsArticleAdmin(ContentAdmin):
    list_display = ("headline", "status", "category", "reporter", "isFeatured", "publishedAt")
    list_filter = ContentAdmin.list_filter + ("isFeatured", "isBreaking", "contentLabel")
    search_fields = ("headline", "slug", "excerpt", "body")
    autocomplete_fields = ("category", "city", "reporter", "tags")

@admin.register(GroundReport)
class GroundReportAdmin(ContentAdmin):
    form = GroundReportAdminForm
    list_display = ("headline", "status", "reporter", "city", "publishedAt")
    autocomplete_fields = ("city", "reporter")
    readonly_fields = ContentAdmin.readonly_fields + ("media_preview",)
    fields = ("id", "slug", "headline", "excerpt", "body", "media_preview", "image_upload", "image", "video_upload", "videoUrl", "duration", "mapQuery", "status", "views", "locationLabel", "city", "reporter", "publishedAt", "updatedAt", "createdAt")

    @admin.display(description="Media preview")
    def media_preview(self, obj):
        if not obj:
            return "No media"
        parts = []
        if obj.image:
            image_url = urlparse(obj.image)
            if image_url.scheme in {"http", "https"}:
                parts.append(format_html('<img src="{}" alt="Ground report image" style="max-width:320px;max-height:180px;object-fit:contain" />', obj.image))
        if obj.videoUrl:
            video_url = urlparse(obj.videoUrl)
            if video_url.scheme in {"http", "https"}:
                parts.append(format_html('<video src="{}" controls preload="metadata" style="display:block;max-width:320px;max-height:180px"></video>', obj.videoUrl))
        return format_html_join("", "{}<br>", ((part,) for part in parts)) if parts else "No media"

@admin.register(SpecialReport)
class SpecialReportAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "location", "publishedAt")
    list_filter = ("status",)
    search_fields = ("title", "slug", "location", "dek")
    ordering = ("-publishedAt",)
    readonly_fields = ("id", "createdAt")

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("name", "article", "status", "createdAt")
    list_filter = ("status",)
    search_fields = ("name", "message", "article__headline")
    ordering = ("-createdAt",)
    readonly_fields = ("id", "createdAt")
    autocomplete_fields = ("article", "user")
