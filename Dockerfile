FROM node:current-alpine
COPY . /app
WORKDIR /app
RUN yarn
ENTRYPOINT ["./tdr-bot", "start"]
