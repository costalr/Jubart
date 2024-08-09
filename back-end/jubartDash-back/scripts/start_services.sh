#!/bin/bash

# Função para iniciar um serviço
start_service() {
  local service_name=$1
  echo "Iniciando $service_name..."
  sudo systemctl start $service_name
  if [[ $? -eq 0 ]]; then
    echo "$service_name iniciado com sucesso."
  else
    echo "Falha ao iniciar $service_name."
  fi
}

# Iniciar os serviços
start_service celery_beat.service
start_service celery_worker.service
start_service django.service
