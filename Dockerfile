FROM node:12-alpine AS builder
LABEL maintainer="mecab <mecab@misosi.ru>"

WORKDIR /work/app
ADD . ./
RUN npm install
RUN npm run build

WORKDIR /work
RUN apk add --update alpine-sdk perl
RUN git clone https://github.com/hoytech/vmtouch.git

WORKDIR /work/vmtouch
RUN git checkout v1.3.1
RUN make

FROM node:12-alpine
WORKDIR /app

COPY --from=builder /work/app/dist ./dist
COPY --from=builder /work/vmtouch/vmtouch /usr/local/bin/vmtouch
ADD ./package.json ./package-lock.json ./
ADD ./config ./config
ADD ./entrypoint /

RUN echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update --no-cache fd@testing ffmpeg && \
    npm install --only="production" && \
    chmod +x /entrypoint

ENV NODE_ENV=production

ENTRYPOINT ["/entrypoint"]

VOLUME ["/mnt/media"]
EXPOSE 80
