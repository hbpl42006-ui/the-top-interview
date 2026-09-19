from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TagViewSet, StateViewSet, CityViewSet, SiteSettingViewSet, SocialLinkViewSet, DashboardSummaryView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'states', StateViewSet)
router.register(r'cities', CityViewSet)
router.register(r'settings', SiteSettingViewSet)
router.register(r'social-links', SocialLinkViewSet)

urlpatterns = [
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('', include(router.urls)),
]
