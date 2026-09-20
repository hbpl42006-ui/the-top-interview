from rest_framework import viewsets, permissions
from rest_framework.response import Response
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
    queryset = (
        NewsArticle.objects
        .select_related('category', 'city', 'city__state', 'reporter')
        .order_by('-publishedAt')
    )
    serializer_class = NewsArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['slug', 'isBreaking', 'isFeatured', 'category__name', 'city__state__name', 'reporter__slug']

    def get_serializer_class(self):
        if self.action == 'list':
            if self.request.query_params.get('includeTags') == 'false':
                from .serializers import NewsArticleCardSerializer
                return NewsArticleCardSerializer
            from .serializers import NewsArticleListSerializer
            return NewsArticleListSerializer
        return NewsArticleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.defer('body', 'quoteText', 'quoteAttribution', 'keyPoints')
            if self.request.query_params.get('includeTags') != 'false':
                queryset = queryset.prefetch_related('tags')
            return queryset
        return queryset.prefetch_related('tags')

    def list(self, request, *args, **kwargs):
        raw_limit = request.query_params.get('limit')
        if raw_limit is None:
            return super().list(request, *args, **kwargs)

        try:
            limit = min(max(int(raw_limit), 1), 50)
        except (TypeError, ValueError):
            limit = 20

        queryset = self.filter_queryset(self.get_queryset())[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class GroundReportViewSet(viewsets.ModelViewSet):
    queryset = GroundReport.objects.select_related(
        'city', 'city__state', 'reporter'
    ).order_by('-publishedAt')
    serializer_class = GroundReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            from .serializers import GroundReportListSerializer
            return GroundReportListSerializer
        return GroundReportSerializer

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
