from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Video, Image,Profile
from .serializers import VideoSerializer,ProfileSerializer
import os
from django.core.files.storage import default_storage
import logging
logger = logging.getLogger(__name__)
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
class UploadFiles(APIView):
    def post(self, request, *args, **kwargs):
        video_file = request.FILES.get('video')
        title = request.data.get('name')
        background_file = request.FILES.get('background')
        image_files = request.FILES.getlist('images[]') 
        print("Received image files:", image_files) 
        if not video_file or not title:
            return Response({"error": "Both title and video file are required."}, status=status.HTTP_400_BAD_REQUEST)
        if Video.objects.filter(title=title).exists():
            return Response({"error": "A video with this title already exists."}, status=status.HTTP_400_BAD_REQUEST)
        valid_extensions = ['.mp4', '.avi', '.mov']
        file_extension = os.path.splitext(video_file.name)[1]
        if file_extension not in valid_extensions:
            return Response({"error": "Invalid file format. Only MP4, AVI, and MOV files are allowed."}, status=status.HTTP_400_BAD_REQUEST)
        video_file_name = default_storage.save(f'videos/{video_file.name}', video_file)
        video = Video(title=title, video_file=video_file_name)
        if background_file:
            background_file_name = default_storage.save(f'backgrounds/{background_file.name}', background_file)
            video.background = background_file_name
        video.save()
        for img_file in image_files:
            image_file_name = default_storage.save(f'images/{img_file.name}', img_file)
            image = Image(video=video, image_file=image_file_name)
            image.save()
        return Response({
            "message": "Video, background, and images uploaded successfully.",
            "video": VideoSerializer(video).data,
        }, status=status.HTTP_201_CREATED)
class EditProfiles(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        new_profile_picture = request.FILES.get('profile')
        if not email or not new_profile_picture:
            return Response({"error": "Both email and a new profile picture are required."}, 
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            profile = Profile.objects.get(email=email)
        except Profile.DoesNotExist:
            profile = Profile(email=email)
        if profile.profile:
            if default_storage.exists(profile.profile.name):
                default_storage.delete(profile.profile.name)
        new_profile_picture_name = default_storage.save(f'profiles/{new_profile_picture.name}', new_profile_picture)
        profile.profile = new_profile_picture_name
        profile.save()
        return Response({
            "message": "Profile picture updated successfully.",
            "profile": ProfileSerializer(profile).data, 
        }, status=status.HTTP_200_OK)