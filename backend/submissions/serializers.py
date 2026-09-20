import logging

from rest_framework import serializers
from .models import NewsletterSubscriber, NewsSubmission, ContactSubmission
from core.cloudinary_uploads import upload_media_asset

logger = logging.getLogger(__name__)

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
        logger.info(
            "News submission media received: %s%s",
            bool(uploaded),
            f" ({uploaded.name}, {uploaded.content_type}, {uploaded.size} bytes)" if uploaded else "",
        )
        if uploaded:
            try:
                validated_data['mediaUrl'] = upload_media_asset(uploaded, 'submissions')
            except Exception as exc:
                raise serializers.ValidationError({'media': [str(exc)]}) from exc
            logger.info("News submission Cloudinary upload succeeded: secure URL assigned")
        submission = NewsSubmission.objects.create(**validated_data)
        logger.info("News submission saved with media URL: %s", bool(submission.mediaUrl))
        return submission

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'
