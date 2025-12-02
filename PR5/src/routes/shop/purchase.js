const { executePurchase } = require('@/useCases/purchaseResources');

/**
 * @description Route to purchase resources.
 */
module.exports = {
  purchaseResources: {
    url: '/shop/purchase',
    method: 'POST',

    // OpenAPI/Swagger мета-дані — тут, НЕ в schema!
    description: 'Purchase one or more resources',
    summary: 'Create a purchase order and generate a bill',
    tags: ['shop'],

    schema: {
      body: {
        type: 'object',
        required: ['customerId', 'items'],
        additionalProperties: false,
        properties: {
          customerId: {
            type: 'integer',
            minimum: 1,
            description: 'ID of the customer making the purchase',
          },
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['id', 'amount'],
              additionalProperties: false,
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Resource UUID',
                },
                amount: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Quantity to purchase',
                },
              },
            },
          },
        },
      },

      response: {
        201: {
          type: 'object',
          required: ['bill', 'user'],
          properties: {
            bill: {
              type: 'object',
              required: ['_id', 'customerId', 'total', 'items', 'createdAt'],
              properties: {
                _id: { type: 'string' },
                customerId: { type: 'integer' },
                total: { type: 'number', minimum: 0 },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['resourceId', 'name', 'quantity', 'price'],
                    properties: {
                      resourceId: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      quantity: { type: 'integer', minimum: 1 },
                      price: { type: 'number', minimum: 0 },
                    },
                  },
                },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
            user: {
              type: 'object',
              required: ['id', 'name', 'balance'],
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                age: { type: 'integer', minimum: 0 },
                email: { type: 'string', format: 'email' },
                balance: { type: 'number', minimum: 0 },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Insufficient funds' },
          },
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },

    handler: async (request, reply) => {
      try {
        const order =
          /** @type {{ customerId: number; items: Array<{ id: string; amount: number }> }} */ (
            request.body
          );

        const result = await executePurchase(order);

        return reply.code(201).send(result);
      } catch (error) {
        // Логування з контекстом
        if (error.cause) {
          request.log.debug(
            { cause: error.cause },
            'Purchase failed with handled error'
          );
        } else {
          request.log.error(error, 'Unexpected error during purchase');
        }

        // Повертаємо 400 для бізнес-помилок (недостатньо грошей, немає в наявності тощо)
        const statusCode = error.cause ? 400 : 500;
        return reply.code(statusCode).send({ error: error.message });
      }
    },
  },
};
