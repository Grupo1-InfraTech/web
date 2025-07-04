# Generated by Django 5.2.3 on 2025-07-03 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Incidente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('category', models.CharField(max_length=50)),
                ('priority', models.CharField(max_length=20)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('openingTime', models.DateTimeField(blank=True, null=True)),
                ('closingTime', models.DateTimeField(blank=True, null=True)),
                ('assignedTo', models.CharField(blank=True, max_length=100, null=True)),
                ('status', models.CharField(max_length=20)),
                ('resolution', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
