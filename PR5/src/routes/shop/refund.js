const { executeRefund } = require('@/useCases/refundPurchase');

/**
 * @description Route to refund a purchase by bill ID.
 */
module.exports = {
  refundPurchase: {
    url: '/shop/refund',
    method: 'POST',

    // OpenAPI мета-дані — тут, НЕ в schema!
    description: 'Refund a completed purchase',
    summary: 'Return money and restore resource stock by bill ID',
    tags: ['shop'],

    schema: {
      body: {
        type: 'object',
        required: ['billId'],
        additionalProperties: false,
        properties: {
          billId: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            description: 'MongoDB _id of the bill to refund',
          },
        },
      },

      response: {
        200: {
          type: 'object',
          required: ['refundedBill', 'user'],
          properties: {
            refundedBill: {
              type: 'object',
              required: ['_id', 'customerId', 'total', 'items', 'createdAt'],
              properties: {
                _id: { type: 'string' },
                customerId: { type: 'integer' },
                total: { type: 'number', minimum: 0 },
                items: {
                  type: 'array',
                  minItems: 1,
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
            error: {
              type: 'string',
              example: 'Bill already refunded or not found',
            },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Bill not found' },
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
        const { billId } = /** @type {{ billId: string }} */(request.body);

        const result = await executeRefund(billId);

        return reply.code(200).send(result);
      } catch (error) {
        // Логування з контекстом
        if (error.cause) {
          request.log.debug(
            { cause: error.cause, billId: request.body.billId },
            'Refund failed with handled business error'
          );
        } else {
          request.log.error(error, 'Unexpected error during refund');
        }

        // Бізнес-помилки (вже оброблені в use case) → 400
        // Технічні (неочікувані) → 500
        const statusCode = error.cause ? 400 : 500;

        return reply.code(statusCode).send({ error: error.message });
      }
    },
  },
};