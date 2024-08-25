from django.db import models

class LatestFile(models.Model):
    file_type = models.CharField(max_length=255)
    file_key = models.CharField(max_length=255)
    last_month = models.CharField(max_length=2, null=True, blank=True) 
    last_year = models.CharField(max_length=4, null=True, blank=True)   
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_hash = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        app_label = 'apiCommon'

    def __str__(self):
        return f"{self.file_type} - {self.last_year}-{self.last_month}"
