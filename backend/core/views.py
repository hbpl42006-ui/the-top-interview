from rest_framework import viewsets, permissions
from .models import Category, Tag, State, City, SiteSetting, SocialLink
from .serializers import (
    CategorySerializer, TagSerializer, StateSerializer, 
    CitySerializer, SiteSettingSerializer, SocialLinkSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['name', 'slug']

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all().order_by('name')
    serializer_class = StateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['slug']

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('name')
    serializer_class = CitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['state']

class SiteSettingViewSet(viewsets.ModelViewSet):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'key'

class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

from rest_framework.views import APIView
from rest_framework.response import Response
from news.models import NewsArticle, GroundReport, Reporter, Comment
from submissions.models import NewsSubmission
from media_content.models import Interview, PodcastEpisode, Video
from submissions.models import NewsletterSubscriber, ContactSubmission
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

User = get_user_model()

class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        news_total = NewsArticle.objects.count()
        news_published = NewsArticle.objects.filter(status="PUBLISHED").count()
        news_draft = NewsArticle.objects.filter(status="DRAFT").count()
        
        ground_reports_total = GroundReport.objects.count()
        interviews_total = Interview.objects.count()
        podcasts_total = PodcastEpisode.objects.count()
        videos_total = Video.objects.count()
        reporters_total = Reporter.objects.count()
        users_total = User.objects.count()
        subscribers_total = NewsletterSubscriber.objects.filter(is_active=True).count()
        
        pending_comments = Comment.objects.filter(status="PENDING").count()
        approved_comments = Comment.objects.filter(status="APPROVED").count()
        pending_submissions = NewsSubmission.objects.filter(status="PENDING").count()
        pending_contact = ContactSubmission.objects.filter(status="PENDING").count()
        
        top_articles = list(NewsArticle.objects.filter(status="PUBLISHED").order_by("-views")[:5].values("headline", "views"))
        top_ground_reports = list(GroundReport.objects.filter(status="PUBLISHED").order_by("-views")[:5].values("headline", "views"))
        top_episodes = list(PodcastEpisode.objects.filter(status="PUBLISHED").order_by("-plays")[:5].values("title", "plays"))
        
        # State counts
        states = State.objects.annotate(
            article_count=Count("city__newsarticle", filter=Q(city__newsarticle__status="PUBLISHED"), distinct=True),
            ground_report_count=Count("city__groundreport", filter=Q(city__groundreport__status="PUBLISHED"), distinct=True)
        )
        content_by_state = []
        for s in states:
            total = s.article_count + s.ground_report_count
            if total > 0:
                content_by_state.append({"state": s.name, "value": total})
        
        content_by_state.sort(key=lambda x: x["value"], reverse=True)

        return Response({
            "content": {
                "news": {"total": news_total, "published": news_published, "draft": news_draft},
                "groundReports": ground_reports_total,
                "interviews": interviews_total,
                "podcastEpisodes": podcasts_total,
                "videos": videos_total,
                "specialReports": 0,
                "reporters": reporters_total,
                "users": users_total,
            },
            "engagement": {
                "newsletterSubscribers": subscribers_total,
                "pendingComments": pending_comments,
                "approvedComments": approved_comments,
                "pendingSubmissions": pending_submissions,
                "pendingContact": pending_contact,
            },
            "topArticles": [{"label": a["headline"], "value": a["views"]} for a in top_articles],
            "topGroundReports": [{"label": g["headline"], "value": g["views"]} for g in top_ground_reports],
            "topEpisodes": [{"label": e["title"], "value": e["plays"]} for e in top_episodes],
            "contentByState": content_by_state
        })
