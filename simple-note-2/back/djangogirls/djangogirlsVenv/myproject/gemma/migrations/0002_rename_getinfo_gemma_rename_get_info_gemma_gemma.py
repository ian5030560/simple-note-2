# Generated by Django 4.2.7 on 2024-03-19 08:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gemma', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='GetInfo',
            new_name='Gemma',
        ),
        migrations.RenameField(
            model_name='gemma',
            old_name='get_info',
            new_name='gemma',
        ),
    ]