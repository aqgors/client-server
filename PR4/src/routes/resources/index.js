// src/routes/resources.js
const { createResource } = require('./createResource');
const { getResources } = require('./getResources');
const { getResource } = require('./getResource');
const { updateResource } = require('./updateResource');
const { patchResource } = require('./patchResource');
const { deleteResource } = require('./deleteResource');

/**
 * Register all resource routes
 * @param {import('fastify').FastifyInstance} fastify
 */
async function resourcesRouter(fastify) {
  fastify.route(createResource);
  fastify.route(getResources);
  fastify.route(getResource);
  fastify.route(updateResource);
  fastify.route(patchResource);
  fastify.route(deleteResource);
}

module.exports = { resourcesRouter };
