from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/import/', include('apiImport.urls')),
    path('api/export/', include('apiExport.urls')),
    path('api/common/', include('apiCommon.urls')),
    path('api/local/', include('apiLocal.urls')), 
]
