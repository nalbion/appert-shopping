import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import promotionsService from './promotions-service';
import Cart, { CartItem } from '../models/cart';

chai.use(chaiAsPromised);

describe('PromotionsService', () => {
  it('should not charge for free Raspberry Pi B with a MacBook Pro purchase', async () => {
    // Given
    const cart = createCart([
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '234234', name: 'Raspberry Pi B', price: 30.0 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[1].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['Free Raspberry Pi B with MacBook Pro purchase']);
    expect(cart.calculateTotal()).to.equal(5399.99);
  });

  it('should add a free Raspberry Pi B with a MacBook Pro purchase', async () => {
    // Given
    const cart = createCart([{ sku: '43N23P', name: 'MacBook Pro', price: 5399.99 }]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[1].sku).to.equal('234234');
    expect(cart.items[1].name).to.equal('Raspberry Pi B');
    expect(cart.items[1].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['Free Raspberry Pi B with MacBook Pro purchase']);
    expect(cart.calculateTotal()).to.equal(5399.99);
  });

  it('should add a free Raspberry Pi B with 2 MacBook Pro purchases', async () => {
    // Given
    const cart = createCart([
      { sku: '234234', name: 'Raspberry Pi B', price: 30.0 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[0].price).to.equal(0);
    expect(cart.items[3].sku).to.equal('234234');
    expect(cart.items[3].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['Free Raspberry Pi B with MacBook Pro purchase']);
    expect(cart.calculateTotal()).to.equal(10799.98);
  });

  it('should not charge for 3rd Google Home', () => {
    // Given
    const cart = createCart([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[2].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(99.98);
  });

  it('should add 3rd Google Home when 2 are purchased', () => {
    // Given
    const cart = createCart([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[2].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(99.98);
  });

  it('should add 6th Google Home when 5 are purchased', () => {
    // Given
    const cart = createCart([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[5].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(199.96);
  });

  it('should not apply a discount for 3 Alexa speakers', () => {
    // Given
    const cart = createCart([
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    for (const item of cart.items) {
      expect(item.price).to.equal(109.5);
    }

    expect(cart.promotionsApplied.length).to.equal(0);
    expect(cart.calculateTotal()).to.equal(328.5);
  });

  it('should apply a discount for more than 3 Alexa speakers', () => {
    // Given
    const cart = createCart([
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
    ]);

    // When
    promotionsService.applyToCart(cart);

    // Then
    for (const item of cart.items) {
      expect(item.price).to.equal(98.55);
    }

    expect(cart.promotionsApplied).to.deep.equal(['Alexa Speaker bulk discount']);
    expect(cart.calculateTotal()).to.equal(98.55 * 4);
  });
});

function createCart(items: Array<CartItem>) {
  const cart = new Cart('test');
  cart.items = items;
  return cart;
}
