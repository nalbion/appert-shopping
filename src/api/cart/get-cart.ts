import { Context } from 'koa';
import { getCartById } from '../../service/cart-service';

const getCart = (ctx: Context) => {
  const cart = getCartById(ctx.state.cartId);

  ctx.body = cart;
  ctx.status = 200;
};

export default getCart;

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *     - Cart
 *     summary: Retrieves the contents of the cart
 *     operationId: getCart
 *     responses:
 *       '200':
 *         x-summary: Success
 *         description: The contents of the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '500':
 *         x-summary: Failure
 *         description: Internal error
 */
