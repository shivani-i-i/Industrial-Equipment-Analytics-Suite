from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # This points to the urls.py INSIDE your analytics folder
    path('api/', include('analytics.urls')), 
]