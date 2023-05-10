import { expect } from 'chai';
import Cart from './cart';

describe('Cart', () => {
  it('should add items to cart', () => {
    // Given
    const cart = new Cart('test');

    // When
    cart.addToCart('43N23P', 'MacBook Pro', 5399.99, 1);
    cart.addToCart('234234', 'Raspberry Pi B', 30.0, 3);
    cart.calculateTotal();

    // Then
    expect(cart.items).to.deep.equal([
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '234234', name: 'Raspberry Pi B', price: 30.0 },
      { sku: '234234', name: 'Raspberry Pi B', price: 30.0 },
      { sku: '234234', name: 'Raspberry Pi B', price: 30.0 },
    ]);
    expect(cart.total).to.equal(5489.99);
  });
});
