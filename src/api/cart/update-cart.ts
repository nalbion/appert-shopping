import { Context } from 'koa';
import { updateCartById } from '../../service/cart-service';
import promotionsService from '../../service/promotions-service';
import { validateModel } from '../validator';

const updateCart = async (ctx: Context) => {
  const update = ctx.request.body as { sku: string; quantity: number };
  validateModel('CartUpdate', update);
  const { sku, quantity } = update;
  const cart = await updateCartById(ctx.state.cartId, sku, quantity);

  await promotionsService.applyToCart(cart);
  cart.calculateTotal();

  ctx.body = cart;
  ctx.status = 200;
};

export default updateCart;

/**
 * @swagger
 * /api/cart:
 *   put:
 *     tags:
 *     - Cart
 *     summary: Updates the quantity for an item in the cart
 *     operationId: updateCart
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/components/schemas/CartItem'
 *         examples:
 *           'Google Home':
 *             value:
 *               sku: 120P90
 *               quantity: 2
 *           'MacBook Pro':
 *             value:
 *               sku: 43N23P
 *               quantity: 1
 *           'Alexa':
 *             value:
 *               sku: A304SD
 *               quantity: 3
 *     responses:
 *       '200':
 *         x-summary: Success
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '500':
 *         x-summary: Failure
 *         description: Internal error
 */
