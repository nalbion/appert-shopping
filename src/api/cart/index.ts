import Router from '@koa/router';
import getCart from './get-cart';
import addToCart from './add-to-cart';

const router = new Router({
  prefix: '/cart',
});

/**
 * @swagger
 *   tags:
 *     name: Cart
 *     description: Shopping Cart
 */

router.get('/', getCart);
router.post('/', addToCart);

export default router;
