from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('apiCommon/', include('apiCommon.urls')),
    path('apiImport/', include('apiImport.urls')),
    path('apiExport/', include('apiExport.urls')),
]
