from rest_framework import serializers
from .models import NewsletterSubscriber, NewsSubmission, ContactSubmission
from core.cloudinary_uploads import upload_media_asset

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'

class NewsSubmissionSerializer(serializers.ModelSerializer):
    media = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = NewsSubmission
        fields = '__all__'

    def create(self, validated_data):
        uploaded = validated_data.pop('media', None)
        if uploaded:
            try:
                validated_data['mediaUrl'] = upload_media_asset(uploaded, 'submissions')
            except Exception as exc:
                raise serializers.ValidationError({'media': [str(exc)]}) from exc
        return super().create(validated_data)

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'
