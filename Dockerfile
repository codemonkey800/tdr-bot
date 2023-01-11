FROM node:current-alpine
COPY . /app
WORKDIR /app
RUN yarn
ENTRYPOINT [ "yarn", "start" ]
