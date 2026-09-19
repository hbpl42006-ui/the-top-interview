from rest_framework import viewsets, permissions
from .models import Guest, Interview, Podcast, PodcastEpisode, Video
from .serializers import (
    GuestSerializer, InterviewSerializer, PodcastSerializer, 
    PodcastEpisodeSerializer, VideoSerializer
)

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all().order_by('name')
    serializer_class = GuestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all().order_by('-publishedAt')
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class PodcastViewSet(viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class PodcastEpisodeViewSet(viewsets.ModelViewSet):
    queryset = PodcastEpisode.objects.all().order_by('-publishedAt')
    serializer_class = PodcastEpisodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-publishedAt')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
