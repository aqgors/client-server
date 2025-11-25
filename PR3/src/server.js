require('module-alias/register');

const { env } = require('./config');
const { bootstrapFastify } = require('./app');
let fastify;

const startServer = async () => {
  try {
    fastify = bootstrapFastify();

    await fastify.listen({
      port: env.PORT,
      host: env.HOST,
    });
  } catch (err) {
    if (fastify && fastify.log) {
      fastify.log.error(err);
    } else {
      console.error('Error starting server:', err);
    }
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  if (fastify) {
    try {
      await fastify.close();
      console.log('Fastify server closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

startServer();
