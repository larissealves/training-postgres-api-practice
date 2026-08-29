# DOCKERFILE - APPLICATION (Backend):

> o backend desta aplicação tem dependencia com arquivos que estão na raiz. O contexto considerado para gerar a imagem será a raiz.

> docker build -f application/Dockerfile .
 
FROM node:22-alpine  #começar com uma imagem que já tenha Node.js.

WORKDIR /app

COPY package*.json ./ #copias as conf package-lock.json e package.json

RUN npm install #executa a aplicação para instalar as dependencias

COPY application/ ./ #copia o restante do backend - tudo que esta no msm pacote deste file
COPY config/ ./config/
COPY database/ ./database/

#COPY envs/ ./envs/

#neste caso o back tem dependencias de outras partes com DB conexães, DB querys e variaveis de ambiente
#necessário realizar COPY dos outros arquivo 
# necessário verificar os imports - caso a estrutura do docker fique diferente pode ser necessário sair ou voltar mais uma pasta 


EXPOSE 3000

CMD ["npm", "run", "dev"]


==> os arquivos .env não foram replicados na imagem. As variaveis são incluídas no docker e ele 'distribui'

# File .dockerignore
registrar arquivos que não devem ser incluídos. 

- notes.md → suas anotações
- notes-docker.md → documentação/anotações do Docker
- README.md → documentação do projeto
- tests/ → não precisamos dos testes para executar a API
- client/ → não precisamos do frontend na imagem do backend
- .env.* → evita enviar credenciais
- node_modules/ → o Docker instala as dependências com npm install

# COMANDOS
docker build -t menu-add-dish-app -f application/Dockerfile .

```Cria a imagem -> nome da aplicação e qual dockfiler(config) usar ```

Agora vamos transformar essa imagem em um container em execução.

Como seu .env.development está na raiz, vamos passar ele para o Docker:

Cria e inicia um container a partir da imagem criada no passo anterior

Pega as variáveis do seu .env.development e disponibiliza dentro do container.

```
docker run --env-file .env.development -p 3000:3000 --name menu-add-dish-app-container menu-add-dish-app

```
======================
> docker ps

┌─────────────────────────────┐
│       FRONTEND (React)      │
│                             │
│  http://localhost:5173      │
└──────────────┬──────────────┘
               │
               │ fetch()
               ↓
┌─────────────────────────────┐
│       BACKEND (Express)     │
│                             │
│  http://localhost:3000      │
│                             │
│  /api/dishes                │
│  /api/tags                  │
│  /api/categories            │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│          Neon DB            │
└─────────────────────────────┘

build: docker build --no-cache -f application/Dockerfile -t menu-add-dish-app .

> Alterou o cód - rebuild na imagem: docker build -f application/Dockerfile -t menu-add-dish-app .

> Container antigo → remove e cria novamente: docker rm -f menu-add-dish-app-container 
> docker run --env-file .env.development -p 3000:3000 --name menu-add-dish-app-container menu-add-dish-app


entar no terminal: docker exec -it menu-add-dish-app-container sh
logs: docker logs menu-add-dish-app-container
stop: docker stop menu-add-dish-app-container
start: docker start menu-add-dish-app-container

http://localhost:3000/api/dishes

=======================

docker run --env-file .env.development -p 3000:3000 --name menu-add-dish-app-container menu-add-dish-app

docker build -t menu-add-dish-app -f application/Dockerfile .
docker rm menu-add-dish-app-container

docker exec -it menu-add-dish-app-container sh

Listar containers: docker ps -a

imagem, container, filesystem e variáveis de ambiente.