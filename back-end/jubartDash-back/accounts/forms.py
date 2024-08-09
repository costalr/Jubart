from django import forms
from django.contrib.auth.models import User
from .models import Company

class CompanyAdminForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, required=False, help_text="Deixe em branco para gerar automaticamente.")

    class Meta:
        model = Company
        fields = ['name', 'code', 'serial', 'password']

    def save(self, commit=True):
        company = super().save(commit=False)
        if 'password' in self.cleaned_data and self.cleaned_data['password']:
            user = User.objects.create_user(
                username=company.code,
                password=self.cleaned_data['password']
            )
            company.user = user
        if commit:
            company.save()
        return company
