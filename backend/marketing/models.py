import cuid
from django.db import models

class AdPlacement(models.TextChoices):
    HEADER = "HEADER", "Header"
    IN_ARTICLE = "IN_ARTICLE", "In Article"
    SIDEBAR = "SIDEBAR", "Sidebar"
    HOMEPAGE = "HOMEPAGE", "Homepage"
    VIDEO_PAGE = "VIDEO_PAGE", "Video Page"
    PODCAST_PAGE = "PODCAST_PAGE", "Podcast Page"
    FOOTER = "FOOTER", "Footer"

class Advertisement(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    name = models.CharField(max_length=255)
    placement = models.CharField(max_length=50, choices=AdPlacement.choices)
    creativeUrl = models.CharField(max_length=1024, null=True, blank=True)
    targetUrl = models.CharField(max_length=1024, null=True, blank=True)
    isActive = models.BooleanField(default=False)
    startDate = models.DateTimeField(null=True, blank=True)
    endDate = models.DateTimeField(null=True, blank=True)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Advertisement'
        indexes = [
            models.Index(fields=['placement', 'isActive']),
        ]

    def __str__(self):
        return self.name
