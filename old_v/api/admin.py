from django.contrib import admin

from api import models

# Register your models here.


admin.site.register(models.User)
admin.site.register(models.UserAvatar)
admin.site.register(models.UserProfile)
admin.site.register(models.UserRating)
admin.site.register(models.UserBlacklist)
admin.site.register(models.UserSubscriptions)
admin.site.register(models.UserAdditionalInformation)
admin.site.register(models.RequestUserSubscriptions)


admin.site.register(models.RequestCommunityParticipant)
admin.site.register(models.Article)
admin.site.register(models.ArticleComment)



admin.site.register(models.Community)
admin.site.register(models.CommunityAvatar)
admin.site.register(models.CommunityRole)
admin.site.register(models.CommunityParticipant)

admin.site.register(models.Room)
admin.site.register(models.RoomParticipant)
admin.site.register(models.RoomMessage)