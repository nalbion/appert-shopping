export type CartItem = {
  sku: string;
  price: number;
  discounted?: boolean;
};

export default class Cart {
  private id: string;

  items: Array<CartItem> = [];
  promotionsApplied: string[] = [];
  total = 0;

  constructor(id: string) {
    this.id = id;
  }

  addToCart(sku: string, quantity: number, price: number) {
    console.info(`adding ${quantity} x ${sku} to cart ${this.id} at ${price}`);
    while (quantity-- != 0) {
      this.items.push({ sku, price });
    }
  }

  removeItemAt(i: number) {
    const removed = this.items.splice(i, 1);
    console.debug('removed item from cart:', removed[0]);
  }

  calculateTotal() {
    this.total = this.items.reduce((total, item) => {
      return total + item.price;
    }, 0);

    return this.total;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       properties:
 *         id:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         promotionsApplied:
 *           type: array
 *           items:
 *             type: string
 *         total:
 *           type: number
 *     CartItem:
 *       properties:
 *         sku:
 *           type: string
 *         price:
 *           type: number
 *         discounted:
 *           type: boolean
 */
