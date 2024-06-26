# Generated by Django 4.2.7 on 2024-06-25 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newMediaFile', '0002_rename_uploadfile_newmediafile_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='newmediafile',
            name='newMediaFile',
        ),
        migrations.AddField(
            model_name='newmediafile',
            name='name',
            field=models.CharField(default=123, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='newmediafile',
            name='photo',
            field=models.ImageField(default=123, upload_to='cars'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='newmediafile',
            name='price',
            field=models.DecimalField(decimal_places=2, default=123, max_digits=5),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='newmediafile',
            name='specs',
            field=models.FileField(default=123, upload_to='specs'),
            preserve_default=False,
        ),
    ]
