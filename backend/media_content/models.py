import cuid
from django.db import models

class ContentStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SCHEDULED = "SCHEDULED", "Scheduled"
    PUBLISHED = "PUBLISHED", "Published"
    UNPUBLISHED = "UNPUBLISHED", "Unpublished"

class Guest(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    photo = models.CharField(max_length=1024)
    bio = models.TextField()
    
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Guest'

    def __str__(self):
        return self.name

class Interview(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    topic = models.CharField(max_length=255)
    excerpt = models.TextField()
    body = models.TextField()
    thumbnail = models.CharField(max_length=1024)
    videoUrl = models.CharField(max_length=1024, null=True, blank=True)
    duration = models.CharField(max_length=50)
    category = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
    views = models.IntegerField(default=0)
    
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, db_column='guestId', related_name='interviews')
    reporter = models.ForeignKey('news.Reporter', on_delete=models.CASCADE, db_column='reporterId', related_name='interviews')
    
    publishedAt = models.DateTimeField(null=True, blank=True)
    updatedAt = models.DateTimeField(auto_now=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Interview'
        indexes = [
            models.Index(fields=['status', 'publishedAt']),
        ]

    def __str__(self):
        return self.topic

class Podcast(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    name = models.CharField(max_length=255, default="The Top Interview Podcasts")
    slug = models.CharField(max_length=255, unique=True)
    
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Podcast'

    def __str__(self):
        return self.name

class PodcastEpisode(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    episodeNumber = models.IntegerField()
    title = models.CharField(max_length=512)
    guestName = models.CharField(max_length=255)
    description = models.TextField()
    cover = models.CharField(max_length=1024)
    audioUrl = models.CharField(max_length=1024)
    duration = models.CharField(max_length=50)
    category = models.CharField(max_length=255)
    youtubeUrl = models.CharField(max_length=1024, null=True, blank=True)
    spotifyUrl = models.CharField(max_length=1024, null=True, blank=True)
    applePodcastsUrl = models.CharField(max_length=1024, null=True, blank=True)
    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
    plays = models.IntegerField(default=0)
    
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, db_column='podcastId', related_name='episodes')
    
    publishedAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'PodcastEpisode'
        unique_together = (('podcast', 'episodeNumber'),)
        indexes = [
            models.Index(fields=['status', 'publishedAt']),
        ]

    def __str__(self):
        return self.title

class Video(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=512)
    category = models.CharField(max_length=255)
    thumbnail = models.CharField(max_length=1024)
    youtubeId = models.CharField(max_length=255)
    duration = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
    views = models.IntegerField(default=0)
    
    publishedAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Video'
        indexes = [
            models.Index(fields=['status', 'publishedAt']),
        ]

    def __str__(self):
        return self.title
