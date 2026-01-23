FROM node:20-alpine

WORKDIR /app/game


COPY game/package*.json ./

RUN npm install

COPY game .

EXPOSE 3000

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

CMD ["npm", "start"]