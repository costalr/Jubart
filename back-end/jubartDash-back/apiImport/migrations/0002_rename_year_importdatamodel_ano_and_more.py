# Generated by Django 5.0.7 on 2024-08-13 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiImport', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='year',
            new_name='ano',
        ),
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='co_ncm',
            new_name='estado',
        ),
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='month_number',
            new_name='mes',
        ),
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='country',
            new_name='pais',
        ),
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='heading',
            new_name='sh4',
        ),
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='metric_fob',
            new_name='total_kg',
        ),
        migrations.RenameField(
            model_name='importdatamodel',
            old_name='metric_kg',
            new_name='total_usd',
        ),
        migrations.RemoveField(
            model_name='importdatamodel',
            name='heading_code',
        ),
        migrations.RemoveField(
            model_name='importdatamodel',
            name='state',
        ),
        migrations.AddField(
            model_name='importdatamodel',
            name='categoria',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='importdatamodel',
            name='especie',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
