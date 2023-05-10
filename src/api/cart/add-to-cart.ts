import { Context } from 'koa';

const addToCart = (ctx: Context) => {
  ctx.body = {
    added: true,
  };
};

export default addToCart;

/**
 * @swagger
 * /cart:
 *   post:
 *     tags:
 *     - Cart
 *     summary: Adds an item to the cart
 *     operationId: addToCart
 *     responses:
 *       '201':
 *         x-summary: Success
 *         description: Item added to cart
 *       '500':
 *         x-summary: Failure
 *         description: Internal error
 */
