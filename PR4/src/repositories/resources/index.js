const { $db, $schemas } = require('@/adapters/postgres');
const { eq, or, ilike } = require('drizzle-orm');
const { v4: uuidv4 } = require('uuid');
/**
 * @description Repository for managing resources
 */
class ResourceRepository {
  /**
   * Create a new resource
   * @param {{ name: string, type: string, amount?: number, price?: number, description?: string }} data
   * @returns {Promise<Object>} Created resource
   */
  
  

  async create(data) {
  const syncedTimestamp = new Date();
  const [newResource] = await $db
    .insert($schemas.resources)
    .values({
      id: uuidv4(), // Генеруємо id вручну
      name: data.name,
      type: data.type,
      description: data.description ?? null,
      amount: data.amount ?? 0,
      price: data.price ?? 0,
      createdAt: syncedTimestamp,
      updatedAt: syncedTimestamp,
    })
    .returning();
  return newResource;
}


  /**
   * Find a resource by ID
   * @param {string} id
   * @returns {Promise<Object|null>} Resource or null
   */
  async findById(id) {
    if (!id) return null;

    const [resource] = await $db
      .select()
      .from($schemas.resources)
      .where(eq($schemas.resources.id, id));

    if (!resource) throw new Error('Resource not found');

    return resource;
  }

  /**
   * Get all resources with optional search and pagination
   * @param {string} [search='']
   * @param {number} [page=1]
   * @param {number} [limit=25]
   * @returns {Promise<Object[]>} List of resources
   */
  async findAll(search = '', page = 1, limit = 25) {
    const _limit = Math.min(limit, 50);
    const offset = (Math.max(page, 1) - 1) * _limit;

    return await $db
      .select()
      .from($schemas.resources)
      .where(
        or(
          ilike($schemas.resources.name, `${search}%`),
          ilike($schemas.resources.type, `${search}%`)
        )
      )
      .offset(offset)
      .limit(_limit);
  }

  /**
   * Update a resource by ID
   * @param {string} id
   * @param {{ amount?: number, price?: number, name?: string, type?: string, description?: string }} data
   * @returns {Promise<Object>} Updated resource
   */
  async update(id, data) {
    const syncedTimestamp = new Date();

    const [updatedResource] = await $db
      .update($schemas.resources)
      .set({ ...data, updatedAt: syncedTimestamp })
      .where(eq($schemas.resources.id, id))
      .returning();

    if (!updatedResource) throw new Error('Resource not found');

    return updatedResource;
  }

  /**
   * Delete a resource by ID
   * @param {string} id
   * @returns {Promise<Object>} Deleted resource
   */
  async delete(id) {
    const [deletedResource] = await $db
      .delete($schemas.resources)
      .where(eq($schemas.resources.id, id))
      .returning();

    if (!deletedResource) throw new Error('Resource not found');

    return deletedResource;
  }
}

module.exports.resourceRepository = new ResourceRepository();
