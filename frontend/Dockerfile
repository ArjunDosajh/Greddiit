FROM node:18.13.0

WORKDIR /usr/src/frontend

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]