# Generated by Django 4.2.7 on 2024-08-06 06:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NewCollaborate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('newCollaborate', models.CharField(max_length=100)),
            ],
        ),
    ]
