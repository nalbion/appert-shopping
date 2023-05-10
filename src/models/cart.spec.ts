import { expect } from 'chai';
import Cart from './cart';

describe('Cart', () => {
  it('should add items to cart', () => {
    // Given
    const cart = new Cart('test');

    // When
    cart.addToCart('43N23P', 1, 5399.99);
    cart.addToCart('234234', 3, 30.0);
    cart.calculateTotal();

    // Then
    expect(cart.items).to.deep.equal([
      { sku: '43N23P', price: 5399.99 },
      { sku: '234234', price: 30.0 },
      { sku: '234234', price: 30.0 },
      { sku: '234234', price: 30.0 },
    ]);
    expect(cart.total).to.equal(5489.99);
  });
});
