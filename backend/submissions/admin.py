from django.contrib import admin
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
    list_display = ("source", "name", "location", "category", "status", "submittedAt")
    list_filter = ("source", "status", "category")
    search_fields = ("name", "contact", "location", "category", "description")
    ordering = ("-submittedAt",)
    readonly_fields = ("id", "submittedAt")

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "department", "status", "submittedAt")
    list_filter = ("department", "status")
    search_fields = ("name", "email", "department", "message")
    ordering = ("-submittedAt",)
    readonly_fields = ("id", "submittedAt")
