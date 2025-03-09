from django.urls import path
from .views import *
urlpatterns = [
    path('UploadFiles', UploadFiles().as_view(),name='UploadFiles'),
    path('EditProfiles',EditProfiles().as_view(),name='EditProfiles'),
]