FROM node:current-alpine
COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build:prod
ENTRYPOINT ["./tdr-bot", "start"]
