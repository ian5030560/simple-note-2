# Generated by Django 4.2.7 on 2024-04-30 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("viewMediaFile", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ViewMediaFile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("viewMediaFile", models.CharField(max_length=100)),
            ],
        ),
        migrations.DeleteModel(
            name="ViewFile",
        ),
    ]
