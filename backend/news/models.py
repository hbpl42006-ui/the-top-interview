import cuid
from django.db import models
from django.conf import settings

class ContentStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SCHEDULED = "SCHEDULED", "Scheduled"
    PUBLISHED = "PUBLISHED", "Published"
    UNPUBLISHED = "UNPUBLISHED", "Unpublished"

class ContentLabel(models.TextChoices):
    NEWS = "NEWS", "News"
    OPINION = "OPINION", "Opinion"
    SPONSORED = "SPONSORED", "Sponsored"

class FactCheckStatus(models.TextChoices):
    VERIFIED = "VERIFIED", "Verified"
    UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
    DISPUTED = "DISPUTED", "Disputed"

class CommentStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"

class Reporter(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    bio = models.TextField()
    photo = models.CharField(max_length=1024)
    twitter = models.CharField(max_length=255, null=True, blank=True)
    instagram = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, db_column='userId', related_name='reporterProfile')
    location = models.ForeignKey('core.City', on_delete=models.SET_NULL, null=True, blank=True, db_column='locationId', related_name='reporters')
    
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Reporter'

    def __str__(self):
        return self.name

class TeamMember(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    bio = models.TextField()
    photo = models.CharField(max_length=1024)
    twitter = models.CharField(max_length=255, null=True, blank=True)
    instagram = models.CharField(max_length=255, null=True, blank=True)
    facebook = models.CharField(max_length=255, null=True, blank=True)
    linkedin = models.CharField(max_length=255, null=True, blank=True)
    isActive = models.BooleanField(default=True)
    displayOrder = models.IntegerField(default=0)
    
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'TeamMember'
        indexes = [
            models.Index(fields=['isActive', 'displayOrder']),
        ]

    def __str__(self):
        return self.name

class NewsArticle(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    headline = models.CharField(max_length=512)
    subheadline = models.CharField(max_length=512, null=True, blank=True)
    excerpt = models.TextField()
    body = models.TextField()
    image = models.CharField(max_length=1024)
    videoUrl = models.CharField(max_length=1024, null=True, blank=True)
    status = models.CharField(max_length=50, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
    contentLabel = models.CharField(max_length=50, choices=ContentLabel.choices, default=ContentLabel.NEWS)
    factCheck = models.CharField(max_length=50, choices=FactCheckStatus.choices, null=True, blank=True)
    isBreaking = models.BooleanField(default=False)
    isFeatured = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    readMinutes = models.IntegerField(default=3)
    quoteText = models.TextField(null=True, blank=True)
    quoteAttribution = models.CharField(max_length=255, null=True, blank=True)
    keyPoints = models.JSONField(null=True, blank=True)
    locationLabel = models.CharField(max_length=255, null=True, blank=True)
    
    category = models.ForeignKey('core.Category', on_delete=models.CASCADE, db_column='categoryId', related_name='articles')
    city = models.ForeignKey('core.City', on_delete=models.SET_NULL, null=True, blank=True, db_column='cityId', related_name='articles')
    reporter = models.ForeignKey(Reporter, on_delete=models.CASCADE, db_column='reporterId', related_name='articles')
    
    tags = models.ManyToManyField(
        'core.Tag',
        through='ArticleTag',
        through_fields=('article', 'tag'),
        related_name='articles',
    )
    
    publishedAt = models.DateTimeField(null=True, blank=True)
    updatedAt = models.DateTimeField(auto_now=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'NewsArticle'
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['status', 'publishedAt']),
        ]

    def __str__(self):
        return self.headline


class ArticleTag(models.Model):
    """Maps Django's article/tag relation to Prisma's legacy join table."""
    article = models.ForeignKey(NewsArticle, on_delete=models.CASCADE, db_column='A')
    tag = models.ForeignKey('core.Tag', on_delete=models.CASCADE, db_column='B')
    pk = models.CompositePrimaryKey('article_id', 'tag_id')

    class Meta:
        managed = False
        db_table = '_ArticleTags'
        unique_together = (('article', 'tag'),)

class GroundReport(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    headline = models.CharField(max_length=512)
    excerpt = models.TextField()
    body = models.TextField()
    image = models.CharField(max_length=1024)
    videoUrl = models.CharField(max_length=1024, null=True, blank=True)
    duration = models.CharField(max_length=50, null=True, blank=True)
    mapQuery = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
    views = models.IntegerField(default=0)
    locationLabel = models.CharField(max_length=255, null=True, blank=True)
    
    city = models.ForeignKey('core.City', on_delete=models.SET_NULL, null=True, blank=True, db_column='cityId', related_name='groundReports')
    reporter = models.ForeignKey(Reporter, on_delete=models.CASCADE, db_column='reporterId', related_name='groundReports')
    
    publishedAt = models.DateTimeField(null=True, blank=True)
    updatedAt = models.DateTimeField(auto_now=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'GroundReport'
        indexes = [
            models.Index(fields=['status', 'publishedAt']),
        ]

    def __str__(self):
        return self.headline

class SpecialReport(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    slug = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=512)
    dek = models.TextField()
    image = models.CharField(max_length=1024)
    location = models.CharField(max_length=255)
    chapters = models.JSONField()
    timeline = models.JSONField()
    status = models.CharField(max_length=50, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
    views = models.IntegerField(default=0)
    
    publishedAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'SpecialReport'
        indexes = [
            models.Index(fields=['status', 'publishedAt']),
        ]

    def __str__(self):
        return self.title

class Comment(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    message = models.TextField()
    status = models.CharField(max_length=50, choices=CommentStatus.choices, default=CommentStatus.PENDING)
    
    article = models.ForeignKey(NewsArticle, on_delete=models.CASCADE, db_column='articleId', related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, db_column='userId', related_name='comments')
    name = models.CharField(max_length=255)
    
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Comment'
        indexes = [
            models.Index(fields=['article', 'status']),
        ]

    def __str__(self):
        return f"Comment by {self.name}"
