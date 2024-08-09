#!/bin/bash

# Obtém o diretório atual do projeto
PROJECT_DIR=$(dirname $(dirname $(realpath $0)))

# Define o caminho para o Python no ambiente virtual
VENV_PYTHON=$PROJECT_DIR/jubartDash/bin/python

# Caminho para o arquivo de variáveis de ambiente do systemd
ENV_FILE=/etc/systemd/system/jubart.env

# Cria o arquivo de variáveis de ambiente com os valores atuais
echo "PROJECT_DIR=$PROJECT_DIR" | sudo tee $ENV_FILE > /dev/null
echo "VENV_PYTHON=$VENV_PYTHON" | sudo tee -a $ENV_FILE > /dev/null

echo "Arquivo de variáveis de ambiente criado em $ENV_FILE"
echo "PROJECT_DIR=$PROJECT_DIR"
echo "VENV_PYTHON=$VENV_PYTHON"

# Substitui o caminho do projeto nos arquivos de serviço systemd
sudo sed -i "s|/caminho/para/seu/projeto|$PROJECT_DIR|g" /etc/systemd/system/django.service
sudo sed -i "s|/caminho/para/seu/projeto|$PROJECT_DIR|g" /etc/systemd/system/celery_worker.service
sudo sed -i "s|/caminho/para/seu/projeto|$PROJECT_DIR|g" /etc/systemd/system/celery_beat.service

# Reinicia os serviços para aplicar as mudanças
sudo systemctl daemon-reload
sudo systemctl restart django.service
sudo systemctl restart celery_worker.service
sudo systemctl restart celery_beat.service

echo "Serviços reiniciados com sucesso"
