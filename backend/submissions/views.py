import logging

from rest_framework import viewsets, permissions
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import NewsletterSubscriber, NewsSubmission, ContactSubmission
from .serializers import (
    NewsletterSubscriberSerializer, NewsSubmissionSerializer, ContactSubmissionSerializer
)

logger = logging.getLogger(__name__)

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all().order_by('-subscribedAt')
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [permissions.AllowAny] # Usually allow anyone to subscribe

class NewsSubmissionViewSet(viewsets.ModelViewSet):
    queryset = NewsSubmission.objects.all().order_by('-submittedAt')
    serializer_class = NewsSubmissionSerializer
    permission_classes = [permissions.AllowAny] # Public tips
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def create(self, request, *args, **kwargs):
        logger.info("News submission request media received: %s", bool(request.FILES.get("media")))
        return super().create(request, *args, **kwargs)

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all().order_by('-submittedAt')
    serializer_class = ContactSubmissionSerializer
    permission_classes = [permissions.AllowAny] # Public contact forms
