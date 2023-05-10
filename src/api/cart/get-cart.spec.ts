import { expect } from 'chai';
import { Context } from 'koa';
import getCart from './get-cart';
import { validateModel } from '../validator';
import Cart from '../../models/cart';

const mockCtx = {
  state: {
    cartId: 'test',
  },
} as Context;

describe('Route - GET /api/cart', () => {
  it('should return OK', async () => {
    await getCart(mockCtx);

    expect(mockCtx.status).to.equal(200);
    expect(mockCtx).to.have.property('body');

    const cart = mockCtx.body as Cart;
    expect(cart.items).to.be.an('array');
    expect(cart.total).to.be.a('number');
    validateModel('Cart', mockCtx.body as Record<string, unknown>);
  });
});
