from rest_framework import serializers
from .models import Video, Image,Profile
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image_file']
class VideoSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True) 
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_file', 'background', 'images']
class ProfileSerializer(serializers.ModelSerializer):
    profile = serializers.ImageField(use_url=False)
    class Meta:
        model = Profile
        fields = ['id', 'email', 'profile']