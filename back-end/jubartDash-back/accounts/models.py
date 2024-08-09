from django.contrib.auth.models import User
import secrets
from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255, verbose_name='Nome da Empresa')
    code = models.CharField(max_length=255, unique=True, verbose_name='Código da Empresa')
    serial = models.CharField(max_length=255, unique=True, blank=True, verbose_name='Serial')
    password = models.CharField(max_length=255, verbose_name='Senha')
    cnpj = models.CharField(max_length=18, blank=True, null=True, verbose_name='CNPJ')
    cep = models.CharField(max_length=9, blank=True, null=True, verbose_name='CEP')
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name='Logradouro')
    number = models.CharField(max_length=10, blank=True, null=True, verbose_name='Número')
    complement = models.CharField(max_length=255, blank=True, null=True, verbose_name='Complemento')
    neighborhood = models.CharField(max_length=255, blank=True, null=True, verbose_name='Bairro')
    city = models.CharField(max_length=255, blank=True, null=True, verbose_name='Cidade')
    state = models.CharField(max_length=2, blank=True, null=True, verbose_name='Estado')
    phone = models.CharField(max_length=15, blank=True, null=True, verbose_name='Telefone')
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    sector = models.CharField(max_length=255, blank=True, null=True, verbose_name='Setor')

    def save(self, *args, **kwargs):
        if not self.serial:
            self.serial = self.generate_serial()
        super(Company, self).save(*args, **kwargs)

    @staticmethod
    def generate_serial():
        return secrets.token_hex(16)  # Gera um serial aleatório de 32 caracteres (16 bytes em hexadecimal)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"

class Profile(models.Model):
    USER_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('normal', 'Normal'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='normal')
    access_code = models.CharField(max_length=255, unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='profiles')
    is_test_user = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
