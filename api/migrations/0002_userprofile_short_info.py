# Generated by Django 4.1.5 on 2023-05-19 12:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='short_info',
            field=models.CharField(max_length=255, null=True),
        ),
    ]