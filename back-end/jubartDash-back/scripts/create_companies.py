import os
import django
import secrets

# Configura o ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')
django.setup()

from accounts.models import Company

def create_company(name, code):
    serial = secrets.token_hex(16)  # Gera um serial aleatório de 32 caracteres (16 bytes em hexadecimal)
    company, created = Company.objects.get_or_create(name=name, code=code, defaults={'serial': serial})
    if created:
        print(f'Company {name} created with serial: {serial}')
    else:
        print(f'Company {name} already exists with serial: {company.serial}')

if __name__ == '__main__':
    # Aqui você pode adicionar as companhias que deseja criar
    pass
    # Exemplo:
    # create_company('Jubart', 'Jubart123Temp_')
