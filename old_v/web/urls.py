from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path

from django_settings import settings
from web import views

urlpatterns = [
  re_path(r'^(?:.*)/?$', views.index, name='index'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
