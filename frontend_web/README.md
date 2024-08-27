# EasyLog

## Tecnologias utilizadas no projeto

Tecnologias essenciais:

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://pt-br.reactjs.org/)
- [ReactBoostrap](https://react-bootstrap.github.io/)

Outras Tecnologias

- [MobX](https://mobx.js.org/README.html) "Controlador" de tela. 
- [Axios](https://www.npmjs.com/package/axios) Cliente HTTP
- [FontAwasome](https://fontawesome.com/how-to-use/on-the-web/using-with/react) Biblioteca de ícones
- [Jest](https://jestjs.io/) Testing framework


## Pré-requisitos/Dependências

- [Docker](https://www.docker.com/) ou yarn

Caso escolhido a instalação via yarn é necessário instalar todas as dependências do projeto também. Neste tipo de instalação, os testes automátizados devem possuir um segundo banco de dados configurado.


## Rodar aplicação com docker

Executar comandos abaixos na pasta do projeto:

```bash
./bin/run-docker.sh
```

### Recompilar conteineres

Executar comandos abaixos na pasta do projeto:

```bash
cd docker
docker-compose up -d --no-deps --build
```

### Testar aplicação com docker

Executar comandos abaixos na pasta do projeto:

```bash
./bin/run-test-docker.sh
```


## Rodar aplicação com yarn

Antes de iniciar o projeto com o yarn, garanta que tenha instalado todas as dependências do projeto instalada, como por exemplo o banco de dados.

Crie um arquivo de configuração (.env.js) na pasta src.

```bash
cp src/.env.default.js src/.env.js
```

Executar os comandos abaixos na pasta do projeto para rodar a aplicação:

```bash
# development
$ yarn start
```

### Testar aplicação com yarn

Altes de testar a aplicação com yarn garanta que você possua um segundo banco de dados configurado do projeto, para testar a aplicação.

```bash
# unit tests
$ yarn test:e2e

# Tests e2e / integração
$ yarn test:e2e
```

## Support

- Author - Rafael Alexandre Piemontez

## License