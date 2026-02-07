from django.db import models

class AnalysisHistory(models.Model):
    filename = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    total_equipment = models.IntegerField()
    avg_flowrate = models.FloatField()
    critical_count = models.IntegerField()

    class Meta:
        ordering = ['-upload_date'] # Keeps latest 5 at the top