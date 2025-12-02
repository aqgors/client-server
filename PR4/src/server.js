require('module-alias/register');

const { env } = require('@/config');
const { bootstrapFastify } = require('@/app');

const infra = require('@/infra');
let fastify;

const startServer = async () => {
  try {
    await infra.bootstrapInfra();
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

    await infra.shutdownInfra();
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  let shutdownFailed = false;

  try {
    if (fastify) {
      try {

        await fastify.close();

        console.log('Fastify server closed.');
      } catch (err) {
        console.error('Error during app shutdown:', err);

        shutdownFailed = true;
      }
    }

    await infra.shutdownInfra();
  } catch (err) {
    console.error('Error during infrastructure shutdown:', err);

    shutdownFailed = true;
  } finally {
    if (shutdownFailed) {
      process.exit(1);
    } else {
      console.log('Shutdown complete. Exiting process.');

      process.exit(0);
    }
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
