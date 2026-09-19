from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GuestViewSet, InterviewViewSet, PodcastViewSet, 
    PodcastEpisodeViewSet, VideoViewSet
)

router = DefaultRouter()
router.register(r'guests', GuestViewSet)
router.register(r'interviews', InterviewViewSet)
router.register(r'podcasts', PodcastViewSet)
router.register(r'episodes', PodcastEpisodeViewSet)
router.register(r'videos', VideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
