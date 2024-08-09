import boto3
import os
import django
from django.conf import settings

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')
django.setup()

def list_s3_objects():
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

    response = s3_client.list_objects_v2(Bucket='jubart-dashboard', Prefix='data/')
    if 'Contents' in response:
        for obj in response['Contents']:
            print(f"Found object: {obj['Key']}")
    else:
        print("No objects found.")

if __name__ == '__main__':
    list_s3_objects()
