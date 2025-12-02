const { resourceRepository } = require('@/repositories/resources');

/**
 * @description Route to fetch all resources.
 */

module.exports = {
  /**
   * @type {import('fastify').RouteOptions}
   */
  getResources: {
    url: '/resources',
    method: 'GET',

    handler: async (request, reply) => {
      try {
        // Отримуємо всі ресурси без фільтрів
        const list = await resourceRepository.findAll();

        return reply.code(200).send(list);
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Failed to fetch resources' });
      }
    },
  },
};
