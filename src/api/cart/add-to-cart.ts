import { Context } from 'koa';
import { addToCartById } from '../../service/cart-service';
import promotionsService from '../../service/promotions-service';
import { validateModel } from '../validator';

const addToCart = async (ctx: Context) => {
  const update = (ctx.request as unknown as { body: { sku: string; quantity: number } }).body;
  validateModel('CartUpdate', update);
  const { sku, quantity } = update;
  const cart = await addToCartById(ctx.state.cartId, sku, quantity);

  await promotionsService.applyToCart(cart);
  cart.calculateTotal();

  ctx.body = cart;
  ctx.status = 201;
};

export default addToCart;

/**
 * @swagger
 * /api/cart:
 *   post:
 *     tags:
 *     - Cart
 *     summary: Adds an item to the cart
 *     operationId: addToCart
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
 *       '201':
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
