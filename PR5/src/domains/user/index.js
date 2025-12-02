/**
 * @implements {Domain.UserEntity}
 */
class User {
  /**
   * @param {Domain.UserConstructorFields} fields
   */
  constructor(fields) {
    this.id = fields.id;
    this.name = fields.name;
    this.age = fields.age;
    this.email = fields.email;
    this.balance = fields.balance ?? 0;
  }

  /**
   * Updates the user's balance by the given amount and returns the user.
   * @param {number} amount
   * @returns {Domain.UserEntity}
   */
  updateBalance(amount) {
    const newBalance = this.balance + amount;

    if (newBalance < 0) {
      throw new Error('Insufficient balance. The balance cannot be negative.');
    }

    this.balance = newBalance;
    return this;
  }
}

module.exports = { User };