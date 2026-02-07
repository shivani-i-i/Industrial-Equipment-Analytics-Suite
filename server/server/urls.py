from django.urls import path
from . import views

urlpatterns = [
    # These paths combine with 'api/' from the main urls.py
    path('upload/', views.upload_csv, name='upload_csv'),
    path('export-pdf/', views.export_pdf, name='export_pdf'),
]