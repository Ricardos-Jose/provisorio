/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {string} nome
 * @property {number} preco
 * @property {number} quantidade
 */

const CART_STORAGE_KEY = "carrinho";

export class CarrinhoRepository {
  /**
   * Returns all items from the cart.
   *
   * @returns {CartItem[]}
   */
  findAll() {
    const raw = localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const items = JSON.parse(raw);

      // Optional safety validation
      if (!Array.isArray(items)) {
        return [];
      }

      return items;
    } catch {
      return [];
    }
  }

  /**
   * Finds a cart item by ID.
   *
   * @param {number} id
   * @returns {CartItem|null}
   */
  findById(id) {
    return this.findAll().find((item) => item.id === id) ?? null;
  }

  /**
   * Returns the total number of items in the cart
   * considering quantity.
   *
   * Example:
   * 3 cookies + 2 cakes = 5
   *
   * @returns {number}
   */
  getQuantidadeTotal() {
    return this.findAll().reduce((total, item) => total + item.quantidade, 0);
  }

  /**
   * Returns the total cart price.
   *
   * @returns {number}
   */
  getValorTotal() {
    return this.findAll().reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  }

  /**
   * Removes all content from the cart
   */
  clear() {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
}
