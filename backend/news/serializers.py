from rest_framework import serializers
from .models import Reporter, NewsArticle, GroundReport, SpecialReport, TeamMember, Comment
from core.serializers import CategorySerializer, TagSerializer

class ReporterSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()
    articleCount = serializers.SerializerMethodField()
    groundReportCount = serializers.SerializerMethodField()
    interviewCount = serializers.SerializerMethodField()

    class Meta:
        model = Reporter
        fields = '__all__'

    def get_location(self, obj):
        if obj.location:
            return {'name': obj.location.name, 'state': {'name': obj.location.state.name if obj.location.state else ''}}
        return None

    def get_articleCount(self, obj):
        return obj.articles.count()

    def get_groundReportCount(self, obj):
        return obj.ground_reports.count()

    def get_interviewCount(self, obj):
        return obj.interviews.count()

class NewsArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    categoryId = serializers.CharField(write_only=True, source='category_id', required=False)
    tags = TagSerializer(many=True, read_only=True)
    tagIds = serializers.ListField(write_only=True, required=False)
    city = serializers.SerializerMethodField()
    reporter = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = '__all__'

    def get_city(self, obj):
        if obj.city:
            return {'name': obj.city.name, 'state': {'name': obj.city.state.name if obj.city.state else ''}}
        return None
        
    def get_reporter(self, obj):
        if obj.reporter:
            return {'slug': obj.reporter.slug, 'name': obj.reporter.name}
        return None

class GroundReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroundReport
        fields = '__all__'

class SpecialReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialReport
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
