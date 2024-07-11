# Generated by Django 3.2.25 on 2024-07-09 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ImportDataModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('co_ncm', models.CharField(max_length=255)),
                ('year', models.CharField(max_length=4)),
                ('month_number', models.CharField(max_length=2)),
                ('country', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=255)),
                ('ncm', models.CharField(max_length=255)),
                ('heading_code', models.CharField(max_length=255)),
                ('heading', models.CharField(max_length=255)),
                ('metric_fob', models.FloatField()),
                ('metric_kg', models.FloatField()),
                ('unique_field', models.CharField(max_length=255, unique=True)),
            ],
        ),
    ]
