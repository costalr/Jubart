import os
import sys
import django
import uuid

# Adicionar o diretório raiz do projeto ao sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')
django.setup()

from django.contrib.auth.models import User
from django.core.mail import send_mail
from accounts.models import Company, Profile

def create_user_for_company(company_code, password, user_type, first_name='', last_name=''):
    try:
        company = Company.objects.get(code=company_code)
        username = company.name.lower().replace(' ', '_')
        email = company.email or 'usuario@jubart.com'

        # Criação do usuário associado
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }
        )
        if created:
            user.set_password(password)
            user.save()
            access_code = str(uuid.uuid4())
            Profile.objects.create(user=user, company=company, access_code=access_code, user_type=user_type)

            # Enviar email com as credenciais
            send_mail(
                'Credenciais de Acesso à Dashboard',
                f'Usuário: {user.username}\nSenha: {password}\nCódigo de Acesso: {access_code}\nTipo de Usuário: {user_type}',
                'seuemail@gmail.com',
                [email],
                fail_silently=False,
            )

            print(f'Usuário {username} criado com sucesso.')
        else:
            print(f'Usuário {username} já existe.')
    except Company.DoesNotExist:
        print(f'Empresa com código {company_code} não encontrada.')

if __name__ == "__main__":
    if len(sys.argv) not in [4, 6]:
        print("Uso: python3 create_users.py <codigo_da_empresa> <senha> <tipo_de_usuario> [<first_name> <last_name>]")
        print("Tipo de usuário pode ser 'admin' ou 'normal'")
    else:
        company_code = sys.argv[1]
        password = sys.argv[2]
        user_type = sys.argv[3]
        if user_type not in ['admin', 'normal']:
            print("Tipo de usuário inválido. Use 'admin' ou 'normal'.")
        else:
            first_name = sys.argv[4] if len(sys.argv) > 4 else ''
            last_name = sys.argv[5] if len(sys.argv) > 5 else ''
            create_user_for_company(company_code, password, user_type, first_name, last_name)


# python3 scripts/create_users.py jubart jubartdatatemp123_ admin Jubart Data