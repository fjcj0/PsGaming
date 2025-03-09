from django.db import models
class Video(models.Model):
    title = models.CharField(max_length=200, unique=True)  
    video_file = models.FileField(upload_to='videos/') 
    background = models.FileField(upload_to='backgrounds/')
class Image(models.Model):
    video = models.ForeignKey(Video, related_name='images', on_delete=models.CASCADE)
    image_file = models.ImageField(upload_to='images/')
class Profile(models.Model):
    email = models.EmailField(max_length=254, unique=True, null=True) 
    profile = models.ImageField(upload_to='profiles/')