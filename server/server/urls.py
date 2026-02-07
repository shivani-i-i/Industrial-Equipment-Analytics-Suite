from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # 1. Fixed 'core' to 'urls'
    path('admin/', admin.site.urls), 
    
    # 2. Use include to connect your analytics app
    # This automatically picks up 'upload/' and 'export-pdf/' 
    # from your analytics/urls.py file
    path('api/', include('analytics.urls')), 
]