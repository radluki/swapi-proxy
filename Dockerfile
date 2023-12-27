FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig* ./
COPY nest-cli* ./
COPY .env.docker ./

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
