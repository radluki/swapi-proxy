FROM node:latest

WORKDIR /app

COPY . /app
RUN npm ci
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]
