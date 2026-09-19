from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReporterViewSet, NewsArticleViewSet, GroundReportViewSet, 
    SpecialReportViewSet, TeamMemberViewSet, CommentViewSet
)

router = DefaultRouter()
router.register(r'reporters', ReporterViewSet)
router.register(r'articles', NewsArticleViewSet)
router.register(r'ground-reports', GroundReportViewSet)
router.register(r'special-reports', SpecialReportViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
