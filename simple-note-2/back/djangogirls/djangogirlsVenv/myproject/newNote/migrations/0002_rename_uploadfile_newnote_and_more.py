# Generated by Django 4.2.7 on 2024-04-30 07:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('newNote', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UploadFile',
            new_name='NewNote',
        ),
        migrations.RenameField(
            model_name='newnote',
            old_name='upload_file',
            new_name='newNote',
        ),
    ]