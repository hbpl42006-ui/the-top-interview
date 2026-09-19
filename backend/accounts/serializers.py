from rest_framework import serializers
from .models import User, Notification, Bookmark
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'image', 'createdAt', 'updatedAt', 'is_staff', 'is_active', 'is_superadmin')
        read_only_fields = ('id', 'createdAt', 'updatedAt', 'is_staff', 'is_active', 'is_superadmin')

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'role')

    def create(self, validated_data):
        # We manually hash the password using Django's default hasher
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('id', 'createdAt')

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'
        read_only_fields = ('id', 'createdAt')
