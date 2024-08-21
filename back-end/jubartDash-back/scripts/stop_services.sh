#!/bin/bash

# Função para parar um serviço
stop_service() {
  local service_name=$1
  echo "Parando $service_name..."
  sudo systemctl stop $service_name
  if [[ $? -eq 0 ]]; then
    echo "$service_name parado com sucesso."
  else
    echo "Falha ao parar $service_name."
  fi
}

# Parar os serviços
stop_service celery_beat.service
stop_service celery_worker.service
stop_service django.service