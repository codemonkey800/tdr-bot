FROM node:current-alpine
COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]
