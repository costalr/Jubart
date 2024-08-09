from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.core.mail import send_mail
from .models import Profile, Company
from django import forms

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False

class CustomCompanyAdminForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = '__all__'
        labels = {
            'name': 'Nome da Empresa',
            'code': 'Código da Empresa',
            'serial': 'Serial',
            'password': 'Senha',
            'cnpj': 'CNPJ',
            'cep': 'CEP',
            'address': 'Logradouro',
            'number': 'Número',
            'complement': 'Complemento',
            'neighborhood': 'Bairro',
            'city': 'Cidade',
            'state': 'Estado',
            'phone': 'Telefone',
            'email': 'Email',
            'sector': 'Setor',
        }

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
            # Criação do usuário associado à empresa
            username = instance.name.lower().replace(' ', '_')
            password = self.cleaned_data['password']
            email = self.cleaned_data['email']
            user, created = User.objects.get_or_create(username=username, defaults={'email': email})
            if created:
                user.set_password(password)
                user.save()
                Profile.objects.create(user=user, company=instance)
                send_mail(
                    'Credenciais de Acesso à Dashboard',
                    f'Usuário: {user.username}\nSenha: {password}',
                    'seuemail@dominio.com',
                    [email],
                    fail_silently=False,
                )
        return instance

class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    form = CustomCompanyAdminForm
    list_display = ('name', 'code', 'serial', 'cnpj', 'cep', 'address', 'number', 'complement', 'neighborhood', 'city', 'state', 'phone', 'email', 'sector')
    fields = ('name', 'code', 'serial', 'password', 'cnpj', 'cep', 'address', 'number', 'complement', 'neighborhood', 'city', 'state', 'phone', 'email', 'sector')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'access_code', 'company', 'is_test_user')
