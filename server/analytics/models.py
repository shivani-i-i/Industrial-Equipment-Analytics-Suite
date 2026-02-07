from django.db import models

class EquipmentAnalysis(models.Model):
    filename = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    total_items = models.IntegerField()
    average_risk = models.FloatField()

    def __str__(self):
        return f"{self.filename} - {self.upload_date.strftime('%Y-%m-%d')}"