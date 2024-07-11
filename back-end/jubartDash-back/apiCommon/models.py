from django.db import models

class LatestFile(models.Model):
    file_type = models.CharField(max_length=255)
    file_key = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'apiCommon'
