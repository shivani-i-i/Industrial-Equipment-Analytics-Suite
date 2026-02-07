from django.urls import path
from . import views # This is where the views actually are!

urlpatterns = [
    path('upload/', views.upload_csv, name='upload_csv'),
    path('export-pdf/', views.export_pdf, name='export_pdf'),
]