import { Context } from 'koa';

const getCart = (ctx: Context) => {
  ctx.body = {
    foo: 'bar',
  };
};

export default getCart;

/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *     - Cart
 *     summary: Retrieves the contents of the cart
 *     operationId: getCart
 *     responses:
 *       '200':
 *         x-summary: Success
 *         description: The contents of the cart
 *       '500':
 *         x-summary: Failure
 *         description: Internal error
 */
