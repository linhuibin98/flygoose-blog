# deploy flygoose web
FROM node:18.20.5-alpine3.21

RUN npm install -g pm2 --registry=https://registry.npmmirror.com

RUN adduser -D -u 6666 www

RUN mkdir -p /apps/hellworld-blog ; chown -R www /apps/hellworld-blog/

USER www

#copy flygoose web
COPY ./package.json /apps/hellworld-blog/
COPY ./pm2.config.js /apps/hellworld-blog/
COPY ./.output /apps/hellworld-blog/.output

WORKDIR /apps/hellworld-blog/

EXPOSE 58081

CMD ["sh", "-c", "pm2 start pm2.config.js ; pm2 logs"]
