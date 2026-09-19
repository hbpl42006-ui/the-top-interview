import cuid
from django.db import models

class SubmissionSource(models.TextChoices):
    PUBLIC_VOICE = "PUBLIC_VOICE", "Public Voice"
    NEWS_TIP = "NEWS_TIP", "News Tip"

class SubmissionStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    REVIEWED = "REVIEWED", "Reviewed"
    PUBLISHED = "PUBLISHED", "Published"
    REJECTED = "REJECTED", "Rejected"

class ContactStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    RESOLVED = "RESOLVED", "Resolved"
    SPAM = "SPAM", "Spam"

class NewsletterSubscriber(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    email = models.EmailField(unique=True)
    subscribedAt = models.DateTimeField(auto_now_add=True)
    isActive = models.BooleanField(default=True)

    class Meta:
        db_table = 'NewsletterSubscriber'

    def __str__(self):
        return self.email

class NewsSubmission(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    source = models.CharField(max_length=50, choices=SubmissionSource.choices, default=SubmissionSource.PUBLIC_VOICE)
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    description = models.TextField()
    mediaUrl = models.CharField(max_length=1024, null=True, blank=True)
    status = models.CharField(max_length=50, choices=SubmissionStatus.choices, default=SubmissionStatus.PENDING)
    submittedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'NewsSubmission'
        indexes = [
            models.Index(fields=['status', 'submittedAt']),
        ]

    def __str__(self):
        return f"{self.source} - {self.name}"

class ContactSubmission(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    department = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=50, choices=ContactStatus.choices, default=ContactStatus.PENDING)
    submittedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ContactSubmission'
        indexes = [
            models.Index(fields=['status', 'submittedAt']),
        ]

    def __str__(self):
        return f"Contact from {self.name}"
