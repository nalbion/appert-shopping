import { expect } from 'chai';
import { getCartById, updateCartById } from './cart-service';
import inventoryService from './inventory-service';
import Product from '../models/product';

describe('CartService', () => {
  it('update should remove items from the cart', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);

    const cart = getCartById('test');
    cart.items = [
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 0 },
    ];

    // When
    await updateCartById('test', '120P90', 2);

    // Then
    expect(cart.items).to.deep.equal([
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(11);
  });

  it('update should add items to the cart', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);

    const cart = getCartById('test');
    cart.items = [
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ];

    // When
    await updateCartById('test', '120P90', 3);

    // Then
    expect(cart.items).to.deep.equal([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(9);
  });

  it('update should remove all matching items from the cart', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);

    const cart = getCartById('test');
    cart.items = [
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ];

    // When
    await updateCartById('test', '120P90', 0);

    // Then
    expect(cart.items).to.deep.equal([{ sku: '43N23P', name: 'MacBook Pro', price: 5399.99 }]);
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(12);
  });
});
