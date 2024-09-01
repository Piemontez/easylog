#############################################
# Este dockerfile deve ser utilizado apenas #
# para o desenvolvimento do projeto         #
#############################################

FROM node:18.12.0-alpine

RUN mkdir -p /var/www/app
RUN mkdir -p /var/www/app/dist
WORKDIR /var/www/app

# Copias as pastas do projeto
COPY package.json .
COPY yarn.lock .

# Instala os pacotes para rodar o servidor e os testes
RUN npm install -g ts-node
RUN yarn

# Script que inicia a aplicação
ENTRYPOINT ["yarn", "start:dev"]

