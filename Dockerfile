FROM node:20

WORKDIR /app

RUN npm install -g bun

COPY . .

EXPOSE 4173

CMD [ "bun", "preview", "--host"]