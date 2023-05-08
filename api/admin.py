from django.contrib import admin

from api import models

# Register your models here.


admin.site.register(models.User)
admin.site.register(models.UserAvatar)
admin.site.register(models.UserProfile)
admin.site.register(models.UserRating)
