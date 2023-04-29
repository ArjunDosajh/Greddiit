FROM node:18.13.0

WORKDIR /usr/src/backend

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "server"]