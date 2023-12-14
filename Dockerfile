FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig* ./
COPY nest-cli* ./

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
