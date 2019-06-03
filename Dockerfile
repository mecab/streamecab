FROM node:12-alpine AS builder
LABEL maintainer="mecab <mecab@misosi.ru>"

WORKDIR /work
ADD . ./
RUN npm install
RUN npm run build

FROM node:12-alpine
WORKDIR /app

COPY --from=builder /work/dist ./dist
ADD ./package.json ./package-lock.json ./
ADD ./config ./config

RUN echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update --no-cache fd@testing ffmpeg && \
    npm install --only="production"

ENV NODE_ENV=production

ENTRYPOINT ["npm", "start"]

VOLUME ["/mnt/media"]
EXPOSE 80
