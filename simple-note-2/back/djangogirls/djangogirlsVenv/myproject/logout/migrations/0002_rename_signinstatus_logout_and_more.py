# Generated by Django 4.2.7 on 2024-04-30 07:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logout', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='SigninStatus',
            new_name='Logout',
        ),
        migrations.RenameField(
            model_name='logout',
            old_name='signin_status',
            new_name='logout',
        ),
    ]