FROM node:24

WORKDIR /srv/app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

EXPOSE 3000 9229

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]