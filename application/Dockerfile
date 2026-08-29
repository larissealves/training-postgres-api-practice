FROM node:22-alpine

WORKDIR /app

COPY application/package*.json ./

RUN  npm install

COPY application/ ./application/
COPY config/ ./config/
COPY database/ ./database/

EXPOSE 3000

CMD ["npm", "run", "docker", "--prefix", "application"]