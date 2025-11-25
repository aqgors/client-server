const { resourceRepository } = require('@/repositories/resources');

/**
 * @description Route to partially update a resource by ID. Only `amount` and `price` can be updated.
 */
module.exports = {
  /**
   * @type {import('fastify').RouteOptions}
   */
  patchResource: {
    url: '/resources/:id',
    method: 'PATCH',
    bodyLimit: 1024,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          price: { type: 'number' },
          amount: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    handler: async (request, reply) => {
      try {
        // @ts-ignore
        const { id } = request.params;

        // @ts-ignore
        const { amount, price } = request.body;

        const existing = await resourceRepository.read(id);

        if (!existing) {
          return reply.code(404).send({ error: 'Resource not found' });
        }

        const updatedData = {
          name: existing.name,
          type: existing.type,
          amount: typeof amount !== 'undefined' ? amount : existing.amount,
          price: typeof price !== 'undefined' ? price : existing.price,
        };

        const patched = await resourceRepository.update(id, updatedData);

        return reply.code(200).send(patched);
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Failed to patch resource' });
      }
    },
  },
};
