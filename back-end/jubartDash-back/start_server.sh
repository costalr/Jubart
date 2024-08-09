#!/bin/bash
PORT=${1:-8000}  # Permite especificar uma porta como argumento, padrão é 8000

# Verifica se a porta está em uso e mata o processo, se necessário
if lsof -i:$PORT; then
  echo "A porta $PORT está ocupada. Matando o processo..."
  sudo kill -9 $(sudo lsof -t -i:$PORT)
  sleep 2  # Espera 2 segundos para garantir que o processo foi terminado
  if lsof -i:$PORT; then
    echo "Falha ao liberar a porta $PORT. Tentando novamente..."
    sudo fuser -k 8000/tcp
    sleep 2  # Espera mais 2 segundos para garantir que o processo foi terminado
  fi
else
  echo "A porta $PORT está livre."
fi

# Inicia o servidor Django na porta especificada
python manage.py runserver $PORT
