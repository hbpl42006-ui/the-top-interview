from django.contrib import admin
from .models import Comment, GroundReport, NewsArticle, Reporter, SpecialReport, TeamMember

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
    list_display = ("headline", "status", "reporter", "city", "publishedAt")
    autocomplete_fields = ("city", "reporter")

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
