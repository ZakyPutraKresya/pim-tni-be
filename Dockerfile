FROM node:v18.17.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2900

CMD [ "node", "app.js" ]