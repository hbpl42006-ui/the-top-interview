from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NewsletterSubscriberViewSet, NewsSubmissionViewSet, ContactSubmissionViewSet
)

router = DefaultRouter()
router.register(r'newsletter', NewsletterSubscriberViewSet)
router.register(r'news-tips', NewsSubmissionViewSet)
router.register(r'contact', ContactSubmissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
