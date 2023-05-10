import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import promotionsService from './promotions-service';
import inventoryService from './inventory-service';
import Product from '../models/product';
import Cart, { CartItem } from '../models/cart';

chai.use(chaiAsPromised);

describe('PromotionsService', () => {
  beforeEach(() => {
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);
    inventoryService.setProductQuantity(new Product('43N23P', 'MacBook Pro', 5399.99), 5);
    inventoryService.setProductQuantity(new Product('A304SD', 'Alexa Speaker', 109.5), 10);
    inventoryService.setProductQuantity(new Product('234234', 'Raspberry Pi B', 30.0), 2);
  })

  it('should not charge for free Raspberry Pi B with a MacBook Pro purchase', async () => {
    // Given
    const cart = createCart([
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '234234', name: 'Raspberry Pi B', price: 30.0 },
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[1].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['Free Raspberry Pi B with MacBook Pro purchase']);
    expect(cart.calculateTotal()).to.equal(5399.99);
  });

  it('should add a free Raspberry Pi B with a MacBook Pro purchase', async () => {
    // Given
    const cart = createCart([{ sku: '43N23P', name: 'MacBook Pro', price: 5399.99 }]);

    // When
    await promotionsService.applyToCart(cart);

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
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[0].price).to.equal(0);
    expect(cart.items[3].sku).to.equal('234234');
    expect(cart.items[3].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['Free Raspberry Pi B with MacBook Pro purchase']);
    expect(cart.calculateTotal()).to.equal(10799.98);
  });

  it('should not charge for 3rd Google Home', async () => {
    // Given
    const cart = createCart([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[2].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(99.98);
  });

  it('should add 3rd Google Home when 2 are purchased', async () => {
    // Given
    const cart = createCart([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[2].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(99.98);
  });

  it('should add 6th Google Home when 5 are purchased', async () => {
    // Given
    const cart = createCart([
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items[5].price).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(199.96);
  });

  it('should not apply a discount for 3 Alexa speakers', async () => {
    // Given
    const cart = createCart([
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    for (const item of cart.items) {
      expect(item.price).to.equal(109.5);
    }

    expect(cart.promotionsApplied.length).to.equal(0);
    expect(cart.calculateTotal()).to.equal(328.5);
  });

  it('should apply a discount for more than 3 Alexa speakers', async () => {
    // Given
    const cart = createCart([
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
      { sku: 'A304SD', name: 'Alexa Speaker', price: 109.5 },
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    for (const item of cart.items) {
      expect(item.price).to.equal(98.55);
    }

    expect(cart.promotionsApplied).to.deep.equal(['Alexa Speaker bulk discount']);
    expect(cart.calculateTotal()).to.equal(98.55 * 4);
  });

  it('should support multiple promotions to cart with existing promotions', async () => {
    // Given
    const cart = createCart([
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '234234', name: 'Raspberry Pi B', price: 0, discounted: true },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '120P90', name: 'Google Home', price: 49.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
    ]);
    cart.promotionsApplied = ['Free Raspberry Pi B with MacBook Pro purchase'];

    // When
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items.filter((item) => item.sku === '43N23P').length).to.equal(2);
    expect(cart.items.filter((item) => item.sku === '234234').length).to.equal(2);
    expect(cart.items.filter((item) => item.sku === '120P90').length).to.equal(3);
    expect(cart.items.length).to.equal(7);
    expect(cart.promotionsApplied).to.deep.equal([
      'Free Raspberry Pi B with MacBook Pro purchase',
      '3 Google Homes for the price of 2'
    ]);
    expect(cart.calculateTotal()).to.equal(10899.96);
  });

  it('should support give freebies that are in stock', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 8 - 8);
    inventoryService.setProductQuantity(new Product('43N23P', 'MacBook Pro', 5399.99), 5 - 3);
    
    const cart = createCart([
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      { sku: '43N23P', name: 'MacBook Pro', price: 5399.99 },
      // buy 8, expect 2 at $0 + extra freebie, but only 8 available
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // 1
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // 2
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // free
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // 4
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // 5
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // free
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // 7
      { sku: '120P90', name: 'Google Home', price: 49.99 }, // 8
      // free
    ]);

    // When
    await promotionsService.applyToCart(cart);

    // Then
    expect(cart.items.length).to.equal(5 + 8);
    expect(cart.items.filter((item) => item.sku === '43N23P').length).to.equal(3); // asked fro 3 MacBooks
    expect(cart.items.filter((item) => item.sku === '234234').length).to.equal(2); // only 2 free RPis available
    expect(cart.items.filter((item) => item.sku === '120P90').length).to.equal(8); // only 8 available
    expect(cart.items.filter((item) => item.sku === '120P90' && item.price == 0).length).to.equal(2);
    expect(inventoryService.getProductQuantityInStock('234234')).to.equal(0);
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(0);
    expect(cart.promotionsApplied).to.deep.equal(['Free Raspberry Pi B with MacBook Pro purchase', '3 Google Homes for the price of 2']);
    expect(cart.calculateTotal()).to.equal(16499.91);
  });
});

function createCart(items: Array<CartItem>) {
  const cart = new Cart('test');
  cart.items = items;
  return cart;
}
