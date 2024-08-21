from django.db import models

class ExportDataModel(models.Model):
    ncm = models.CharField(max_length=255) 
    ano = models.CharField(max_length=4) 
    mes = models.CharField(max_length=2)  
    pais = models.CharField(max_length=255)  
    estado = models.CharField(max_length=255)  
    sh4 = models.CharField(max_length=255)  
    total_usd = models.FloatField()  
    total_kg = models.FloatField()  
    categoria = models.CharField(max_length=255, null=True, blank=True)  
    especie = models.CharField(max_length=255, null=True, blank=True)  
    unique_field = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.ncm} - {self.ano} - {self.mes}"
