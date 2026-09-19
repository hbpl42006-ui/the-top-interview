from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from news.models import NewsArticle, GroundReport, Reporter
from media_content.models import Interview, PodcastEpisode

class SearchView(APIView):
    permission_classes = []

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([])
        results = []
        for row in NewsArticle.objects.filter(status='PUBLISHED').filter(Q(headline__icontains=query) | Q(locationLabel__icontains=query))[:6]:
            results.append({'title': row.headline, 'href': f'/news/{row.slug}', 'type': 'News', 'meta': row.category.name})
        for row in GroundReport.objects.filter(status='PUBLISHED').filter(Q(headline__icontains=query) | Q(locationLabel__icontains=query))[:4]:
            results.append({'title': row.headline, 'href': f'/ground-report/{row.slug}', 'type': 'Ground Report', 'meta': row.locationLabel})
        for row in Interview.objects.filter(status='PUBLISHED').filter(Q(topic__icontains=query) | Q(guest__name__icontains=query))[:4]:
            results.append({'title': f'{row.guest.name}: {row.topic}', 'href': f'/interview/{row.slug}', 'type': 'Interview', 'meta': row.guest.designation})
        for row in PodcastEpisode.objects.filter(status='PUBLISHED').filter(Q(title__icontains=query) | Q(guestName__icontains=query))[:3]:
            results.append({'title': row.title, 'href': f'/podcast/{row.slug}', 'type': 'Podcast', 'meta': f'Ep. {row.episodeNumber}'})
        for row in Reporter.objects.filter(Q(name__icontains=query) | Q(designation__icontains=query))[:3]:
            results.append({'title': row.name, 'href': f'/reporter/{row.slug}', 'type': 'Reporter', 'meta': row.designation})
        return Response(results[:20])

urlpatterns = [
    path('api/search/', SearchView.as_view(), name='search'),
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App APIs
    path('api/accounts/', include('accounts.urls')),
    path('api/core/', include('core.urls')),
    path('api/news/', include('news.urls')),
    path('api/media/', include('media_content.urls')),
    path('api/submissions/', include('submissions.urls')),
    path('api/marketing/', include('marketing.urls')),
]
