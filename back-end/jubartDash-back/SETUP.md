# Guia de Instalação e Configuração do Projeto JubartDash

## 1. Clonar o Repositório

```bash
git clone https://github.com/costalr/JubartData
cd jubartDash-back

## 2. Criar e Ativar o Ambiente Virtual
python3 -m venv jubartDash
source jubartDash/bin/activate

## 3. Instalar Dependências
pip install -r requirements.txt

## 4. Configurar o Banco de Dados
python manage.py migrate

## 5. Configurar o Sistema de Filas (Celery)
sudo apt-get install redis-server

## 5.1 Iniciar o redis
sudo service redis-server start

## 6. Configurar os Serviços do Systemd
sudo cp services/django.service /etc/systemd/system/
sudo cp services/celery_worker.service /etc/systemd/system/
sudo cp services/celery_beat.service /etc/systemd/system/


## 6.1.1 Recarregue o daemon do systemd:
sudo systemctl daemon-reload

## 6.1.2 Iniciar e habilitar os serviços
sudo systemctl start django.service
sudo systemctl enable django.service

sudo systemctl start celery_worker.service
sudo systemctl enable celery_worker.service

sudo systemctl start celery_beat.service
sudo systemctl enable celery_beat.service

## 7. Verificar o Status dos Serviços
sudo systemctl status django.service
sudo systemctl status celery_worker.service
sudo systemctl status celery_beat.service

## 8. Acessar o Projeto
http://localhost:8000

## 9. Adicionar usuário ao Grupo jubart 
sudo groupadd jubart
sudo usermod -a -G jubart $USER

## 10. Manutenção dos Scripts
chmod +x scripts/nome_do_script.sh



