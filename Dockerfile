FROM ubuntu:focal

RUN apt-get update -y && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y \
 nodejs

ARG APP_HOME

ENV APP_HOME /var/www/app/

RUN mkdir -p ${APP_HOME}

WORKDIR ${APP_HOME}

COPY package* ${APP_HOME}

RUN npm ci

RUN npm install -g @nestjs/cli

COPY . ${APP_HOME}

EXPOSE 3000

CMD ["npm", "start"]
