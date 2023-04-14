from django.contrib import admin
from django.urls import path, include, re_path
from chat_lm.views import Teacher

urlpatterns = [

    # re_path('teach/{str:text}',  Teacher.train, name=""),
    re_path(r'^teach/(?P<text>\d+)/$', Teacher.train, name=""),
]
