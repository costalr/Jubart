from django.db import models

class ImportDataModel(models.Model):
    co_ncm = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    month_number = models.CharField(max_length=2)
    country = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    ncm = models.CharField(max_length=255)
    heading_code = models.CharField(max_length=255)
    heading = models.CharField(max_length=255)
    metric_fob = models.FloatField()
    metric_kg = models.FloatField()
    unique_field = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.co_ncm} - {self.year} - {self.month_number}"
