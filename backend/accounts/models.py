import cuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserRole(models.TextChoices):
    SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
    ADMIN = "ADMIN", "Admin"
    EDITOR = "EDITOR", "Editor"
    REPORTER = "REPORTER", "Reporter"
    VIDEO_EDITOR = "VIDEO_EDITOR", "Video Editor"
    PODCAST_MANAGER = "PODCAST_MANAGER", "Podcast Manager"
    MODERATOR = "MODERATOR", "Moderator"
    USER = "USER", "User"

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.SUPER_ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, db_column='passwordHash', null=True, blank=True)
    role = models.CharField(
        max_length=50,
        choices=UserRole.choices,
        default=UserRole.USER,
    )
    image = models.TextField(null=True, blank=True)
    
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'User'
        indexes = [
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return self.email

    @property
    def is_superadmin(self):
        return self.role == UserRole.SUPER_ADMIN

class Notification(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userId', related_name='notifications')
    title = models.CharField(max_length=255)
    body = models.TextField()
    read = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Notification'

    def __str__(self):
        return self.title

class Bookmark(models.Model):
    id = models.CharField(max_length=30, primary_key=True, default=cuid.cuid)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userId', related_name='bookmarks')
    article = models.ForeignKey('news.NewsArticle', on_delete=models.CASCADE, db_column='articleId', related_name='bookmarks')
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Bookmark'
        unique_together = (('user', 'article'),)

    def __str__(self):
        return f"{self.user.email} - Bookmark"
