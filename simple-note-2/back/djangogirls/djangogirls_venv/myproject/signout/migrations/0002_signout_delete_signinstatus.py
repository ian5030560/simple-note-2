# Generated by Django 4.2.7 on 2023-12-01 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('signout', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Signout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('signout', models.CharField(max_length=100)),
            ],
        ),
        migrations.DeleteModel(
            name='SigninStatus',
        ),
    ]
