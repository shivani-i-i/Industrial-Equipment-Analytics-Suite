from django.urls import path
from .views import upload_csv, export_pdf

urlpatterns = [
    path('upload/', upload_csv, name='upload_csv'),
    path('export-pdf/', export_pdf, name='export_pdf'),
]