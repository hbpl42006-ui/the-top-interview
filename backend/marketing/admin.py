from urllib.parse import urlparse

from django import forms
from django.contrib import admin
from django.utils.html import format_html

from core.cloudinary_uploads import upload_advertisement_creative
from .models import Advertisement


class AdvertisementAdminForm(forms.ModelForm):
    creative_upload = forms.FileField(
        label="Upload Creative Image / Video",
        required=False,
        help_text="JPG, JPEG, PNG or WEBP up to 5 MB; MP4 up to 20 MB.",
    )

    class Meta:
        model = Advertisement
        fields = "__all__"
        labels = {"creativeUrl": "Existing / External Creative URL", "targetUrl": "Click-through Target URL"}

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("creative_upload"):
            cleaned_data["creativeUrl"] = upload_advertisement_creative(cleaned_data["creative_upload"])
        return cleaned_data

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    form = AdvertisementAdminForm
    list_display = ("name", "placement", "media_preview", "isActive", "startDate", "endDate", "impressions", "clicks")
    list_filter = ("placement", "isActive")
    search_fields = ("name", "creativeUrl", "targetUrl")
    ordering = ("-createdAt",)
    readonly_fields = ("id", "createdAt", "media_preview")
    fields = ("id", "name", "placement", "media_preview", "creative_upload", "creativeUrl", "targetUrl", "isActive", "startDate", "endDate", "impressions", "clicks", "createdAt")

    @admin.display(description="Creative preview")
    def media_preview(self, obj):
        if not obj or not obj.creativeUrl:
            return "No creative selected"
        parsed = urlparse(obj.creativeUrl)
        if parsed.scheme not in {"http", "https"}:
            return "Invalid creative URL"
        if "/video/" in parsed.path or parsed.path.lower().endswith(".mp4"):
            return format_html('<video src="{}" controls preload="metadata" style="max-width:320px;max-height:180px"></video>', obj.creativeUrl)
        return format_html('<img src="{}" alt="Creative preview" style="max-width:320px;max-height:180px;object-fit:contain" />', obj.creativeUrl)
