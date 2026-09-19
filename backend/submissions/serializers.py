from rest_framework import serializers
from .models import NewsletterSubscriber, NewsSubmission, ContactSubmission

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'

class NewsSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsSubmission
        fields = '__all__'

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'
