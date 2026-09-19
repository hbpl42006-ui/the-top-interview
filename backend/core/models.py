import cuid
from django.db import models

class Category(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Category'

    def __str__(self):
        return self.name


class Tag(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'Tag'

    def __str__(self):
        return self.name


class State(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'State'

    def __str__(self):
        return self.name


class City(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    state = models.ForeignKey(State, on_delete=models.CASCADE, db_column='stateId', related_name='cities')

    class Meta:
        db_table = 'City'
        unique_together = (('state', 'name'),)

    def __str__(self):
        return self.name


class SiteSetting(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    key = models.CharField(max_length=255, unique=True)
    value = models.TextField()

    class Meta:
        db_table = 'SiteSetting'

    def __str__(self):
        return self.key


class SocialLink(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    platform = models.CharField(max_length=255, unique=True)
    url = models.CharField(max_length=1024)
    isActive = models.BooleanField(default=True)

    class Meta:
        db_table = 'SocialLink'

    def __str__(self):
        return self.platform


class AnalyticsEvent(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    eventType = models.CharField(max_length=255)
    path = models.CharField(max_length=1024)
    device = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    occurredAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'AnalyticsEvent'
        indexes = [
            models.Index(fields=['eventType', 'occurredAt']),
        ]

    def __str__(self):
        return f"{self.eventType} at {self.path}"
