#!/bin/bash

# Caminho para o diretório do projeto
PROJECT_DIR=/home/lara/Documents/Desenvolvimento/Projetos/Jubart/Dashboard/back-end/jubartDash-back

# Caminho para o Python no ambiente virtual
VENV_PYTHON=$PROJECT_DIR/jubartDash/bin/python

# Navegar para o diretório do projeto
cd $PROJECT_DIR

# Ativar o ambiente virtual
source $PROJECT_DIR/jubartDash/bin/activate

# Iniciar o Celery Worker
nohup $VENV_PYTHON -m celery -A jubartDash worker -l info &

