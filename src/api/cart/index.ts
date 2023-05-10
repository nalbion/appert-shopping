import { Context, Next } from 'koa';
import { v4 as uuidv4 } from 'uuid';
import Router from '@koa/router';
import getCart from './get-cart';
import addToCart from './add-to-cart';
import updateCart from './update-cart';

const router = new Router({
  prefix: '/cart',
});

/**
 * @swagger
 *   tags:
 *     name: Cart
 *     description: Shopping Cart
 * components:
 *   schemas:
 *     CartUpdate:
 *       properties:
 *         sku:
 *           type: string
 *         quantity:
 *           type: number
 *       required:
 *         - sku
 *         - quantity
 */

// TODO: do proper authorisation based on JWT,
//  while supporting anonymous carts which could be transferred to a logged-in user.
//  This would allow registered users to pick up a cart on a different device.
/**
 * Manages a cartId per user
 */
router.use((ctx: Context, next: Next) => {
  let cartId = ctx.cookies.get('cart');

  if (!cartId) {
    cartId = uuidv4();
    ctx.cookies.set('cart', cartId, { path: '/api/cart' });
  }
  ctx.state.cartId = cartId;

  next();
});

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCart);

export default router;
