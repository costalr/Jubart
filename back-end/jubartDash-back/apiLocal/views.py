# apiLocal/views.py
from django.http import JsonResponse
import pandas as pd

def get_import_data(request):
    file_path = '/home/lara/Documents/Desenvolvimento/Projetos/Jubart/Testes/data/pescado_dados_impo.csv'
    try:
        # Leitura do arquivo CSV
        df = pd.read_csv(file_path, delimiter=';', decimal=',')
        
        # Ajuste para garantir que os tipos estão corretos
        df['Ano'] = df['Ano'].astype(int)
        df['Valor US$ FOB'] = pd.to_numeric(df['Valor US$ FOB'], errors='coerce')
        df['Quilograma Líquido'] = pd.to_numeric(df['Quilograma Líquido'], errors='coerce')

        # Log para verificação dos dados do ano passado
        current_year = 2024
        current_month = 6
        previous_year = current_year - 1
        
        previous_year_data = df[(df['Ano'] == previous_year) & (df['Mês'].str.split('.').str[0].astype(int) <= current_month)]
        previous_volume = previous_year_data['Quilograma Líquido'].sum() / 1000
        previous_revenue = previous_year_data['Valor US$ FOB'].sum() / 1000
        previous_avg_price = previous_revenue / previous_volume if previous_volume != 0 else 0
        
        print("\n[BACK-END] Importação - Ano Passado")
        print(f"Volume de Importação Ano Passado (CSV): {previous_volume:,.2f} t")
        print(f"Dispendio de Importação Ano Passado (CSV): {previous_revenue:,.2f} US$")
        print(f"Preço Médio de Importação Ano Passado (CSV): {previous_avg_price:,.2f} US$/t")

        # Conversão para JSON
        data = df.to_dict(orient='records')
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_export_data(request):
    file_path = '/home/lara/Documents/Desenvolvimento/Projetos/Jubart/Testes/data/pescado_dados_expo.csv'
    try:
        # Leitura do arquivo CSV
        df = pd.read_csv(file_path, delimiter=';', decimal=',')
        
        # Ajuste para garantir que os tipos estão corretos
        df['Ano'] = df['Ano'].astype(int)
        df['Valor US$ FOB'] = pd.to_numeric(df['Valor US$ FOB'], errors='coerce')
        df['Quilograma Líquido'] = pd.to_numeric(df['Quilograma Líquido'], errors='coerce')

        # Log para verificação dos dados do ano passado
        current_year = 2024
        current_month = 6
        previous_year = current_year - 1
        
        previous_year_data = df[(df['Ano'] == previous_year) & (df['Mês'].str.split('.').str[0].astype(int) <= current_month)]
        previous_volume = previous_year_data['Quilograma Líquido'].sum() / 1000
        previous_revenue = previous_year_data['Valor US$ FOB'].sum() / 1000
        previous_avg_price = previous_revenue / previous_volume if previous_volume != 0 else 0

        print("\n[BACK-END] Exportação - Ano Passado")
        print(f"Volume de Exportação Ano Passado (CSV): {previous_volume:,.2f} t")
        print(f"Receita de Exportação Ano Passado (CSV): {previous_revenue:,.2f} US$")
        print(f"Preço Médio de Exportação Ano Passado (CSV): {previous_avg_price:,.2f} US$/t")

        # Conversão para JSON
        data = df.to_dict(orient='records')
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
