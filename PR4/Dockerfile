FROM node:24

WORKDIR /srv/app

RUN npm install -g nodemon

COPY package*.json ./

# Install dependencies
RUN npm install

COPY --chown=node:node . .

# Switch to the node user
USER node

# Expose the the app runs on an debugging port
EXPOSE 3000 9229

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

