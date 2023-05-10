import { expect } from 'chai';
import { Context } from 'koa';
import updateCart from './update-cart';
import { validateModel } from '../validator';
import Cart from '../../models/cart';

const mockCtx = {
  state: {
    cartId: 'test',
  },
  request: {
    body: {
      sku: '120P90',
      quantity: 2,
    },
  },
} as unknown as Context;

describe('Route - PUT /api/cart', () => {
  it('should return OK', async () => {
    await updateCart(mockCtx);

    expect(mockCtx.status).to.equal(200);
    expect(mockCtx).to.have.property('body');

    const cart = mockCtx.body as Cart;
    validateModel('Cart', cart as unknown as Record<string, unknown>);
    expect(cart.promotionsApplied[0]).to.equal('3 Google Homes for the price of 2');
  });
});
