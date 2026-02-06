from django.urls import path
from .views import FileUploadView

urlpatterns = [
    # This matches the new FileUploadView class in your views.py
    path('upload/', FileUploadView.as_view(), name='upload_csv'),
]