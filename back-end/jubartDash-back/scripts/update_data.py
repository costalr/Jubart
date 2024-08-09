import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')
django.setup()

from apiImport.tasks import fetch_and_update_import_data
from apiExport.tasks import fetch_and_update_export_data

def update_import_and_export_data():
    fetch_and_update_import_data.delay()
    fetch_and_update_export_data.delay()

if __name__ == "__main__":
    update_import_and_export_data()
