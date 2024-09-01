#!/bin/bash

FILE=config.env

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Criandos pastas configurações
mkdir -p ../backend/tmp/postgres
mkdir -p ../backend/frontend

# Troca para a pasta docs
yes | cp -rf ../frontend_web/build/* ../backend/frontend 

# Troca para a pasta docs
cd ../backend

# Carrega as variáveis de ambiente
if test -f "docker/.env.docker"; then
    source docker/.env.docker
else
    source docker/.env.docker.dev
fi

# Build o container
echo "Buildando o container"
docker build -t easylog_backend_server .

# Para e remove o container atual se existir
echo "Para e remove o container atual se existir"
docker stop easylog_backend_server || true
docker container rm easylog_backend_server || true

# Inicia a aplicação
echo "Iniciando na port ${SYSTEM_PORT}"

docker run \
    -v ".:/var/www/app" \
    -p 3002:3002 \
    --name easylog_backend_server \
    easylog_backend_server
