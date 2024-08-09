from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Company
from django.contrib.auth import authenticate

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('name', 'code', 'serial')
        extra_kwargs = {
            'name': {'label': 'Nome da Empresa'},
            'code': {'label': 'Código da Empresa'},
            'serial': {'label': 'Serial da Empresa'}
        }

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user_type', 'access_code')
        extra_kwargs = {
            'user_type': {'label': 'Tipo de Usuário'},
            'access_code': {'label': 'Código de Acesso'}
        }

class RegisterSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(write_only=True, label='Nome da Empresa')
    company_code = serializers.CharField(write_only=True, label='Código da Empresa')
    password = serializers.CharField(write_only=True, label='Senha')
    password2 = serializers.CharField(write_only=True, label='Confirmação de Senha')

    class Meta:
        model = User
        fields = ('company_name', 'company_code', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("As senhas não correspondem.")
        return data

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        company_code = validated_data.pop('company_code')
        password2 = validated_data.pop('password2')  # Remove password2

        # Criar um nome de usuário baseado no nome da empresa
        username = company_name.lower().replace(' ', '_')
        print(f'Nome de usuário gerado: {username}')  # Adiciona print statement para verificar o nome de usuário

        # Criar o usuário
        user = User.objects.create_user(
            username=username,
            password=validated_data['password']
        )

        # Criar ou obter a empresa
        company, created = Company.objects.get_or_create(name=company_name, code=company_code)

        # Criar o perfil do usuário e associá-lo à empresa
        Profile.objects.create(user=user, company=company)
        return user

class LoginSerializer(serializers.Serializer):
    code = serializers.CharField(label='Código da Empresa')
    password = serializers.CharField(label='Senha', style={'input_type': 'password'})

    def validate(self, data):
        code = data.get('code')
        password = data.get('password')
        print(f'Tentando autenticar com código: {code} e senha: {password}')  # Adiciona print statement para verificar as credenciais

        if code and password:
            try:
                company = Company.objects.get(code=code)
                user = authenticate(username=company.name.lower().replace(' ', '_'), password=password)
                if user:
                    if not user.is_active:
                        raise serializers.ValidationError("Este usuário está desativado.")
                else:
                    raise serializers.ValidationError("As credenciais fornecidas estão incorretas.")
            except Company.DoesNotExist:
                raise serializers.ValidationError("Empresa não encontrada.")
        else:
            raise serializers.ValidationError("É necessário digitar ambos os campos 'Código da Empresa' e 'Senha'.")

        data['user'] = user
        return data
