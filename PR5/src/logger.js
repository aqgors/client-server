const pino = require('pino');

const { env } = require('./config');

const logger = pino({
  level: env.IS_DEV_ENV ? 'debug' : 'info',
  transport: {
    target: '@mgcrea/pino-pretty-compact',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss', 
      ignore: 'pid,hostname', 
    },
  },
});

module.exports = { logger };
