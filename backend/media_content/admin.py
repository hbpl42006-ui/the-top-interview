from django.contrib import admin
from .models import Guest, Interview, Podcast, PodcastEpisode, Video

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "category", "createdAt")
    search_fields = ("name", "slug", "designation", "category")
    ordering = ("name",)
    readonly_fields = ("id", "createdAt")

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ("topic", "status", "guest", "reporter", "publishedAt")
    list_filter = ("status", "category")
    search_fields = ("topic", "slug", "excerpt", "body")
    ordering = ("-publishedAt",)
    readonly_fields = ("id", "createdAt", "updatedAt")
    autocomplete_fields = ("guest", "reporter")

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
