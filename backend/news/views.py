from rest_framework import viewsets, permissions
from .models import Reporter, NewsArticle, GroundReport, SpecialReport, TeamMember, Comment
from .serializers import (
    ReporterSerializer, NewsArticleSerializer, GroundReportSerializer, 
    SpecialReportSerializer, TeamMemberSerializer, CommentSerializer
)

class ReporterViewSet(viewsets.ModelViewSet):
    queryset = Reporter.objects.all()
    serializer_class = ReporterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['slug']

class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all().order_by('-publishedAt')
    serializer_class = NewsArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['slug', 'isBreaking', 'isFeatured', 'category__name', 'city__state__name', 'reporter__slug']

class GroundReportViewSet(viewsets.ModelViewSet):
    queryset = GroundReport.objects.all().order_by('-publishedAt')
    serializer_class = GroundReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class SpecialReportViewSet(viewsets.ModelViewSet):
    queryset = SpecialReport.objects.all().order_by('-publishedAt')
    serializer_class = SpecialReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all().order_by('displayOrder')
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['isActive']

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-createdAt')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
