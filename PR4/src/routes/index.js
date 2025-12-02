// src/routes/index.js
const { echoRoute } = require('./echo');
const { resourcesRouter } = require('./resources');
const { shopRouter } = require('./shop');

function patchRouting(fastify) {
  // Echo route
  fastify.register(echoRoute);

  // Resource CRUD routes
  fastify.register(resourcesRouter);
  fastify.register(shopRouter);

  // Error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    if (error.validation) {
      return reply
        .status(error.statusCode || 400)
        .send({ error: 'Invalid request', message: error.message });
    }

    reply.status(500).send({ error: 'Internal Server Error' });
  });
}

module.exports = { patchRouting };
