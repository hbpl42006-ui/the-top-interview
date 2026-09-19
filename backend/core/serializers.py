from rest_framework import serializers
from .models import Category, Tag, State, City, SiteSetting, SocialLink

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    cities = CitySerializer(many=True, read_only=True)
    storyCount = serializers.SerializerMethodField()

    class Meta:
        model = State
        fields = '__all__'

    def get_storyCount(self, obj):
        from news.models import NewsArticle, GroundReport
        city_ids = obj.cities.values_list('id', flat=True)
        return (
            NewsArticle.objects.filter(city_id__in=city_ids, status='PUBLISHED').count() +
            GroundReport.objects.filter(city_id__in=city_ids, status='PUBLISHED').count()
        )

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = '__all__'
