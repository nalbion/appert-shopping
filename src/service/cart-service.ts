import inventoryService from './inventory-service';
import Cart from '../models/cart';

// TODO: save to DB
const carts: { [id: string]: Cart } = {};

export const getCartById = (cartId: string) => {
  let cart = carts[cartId];

  if (!cart) {
    cart = new Cart(cartId);
    carts[cartId] = cart;
  }

  return cart;
};

export const addToCartById = async (cartId: string, sku: string, quantity: number): Promise<Cart> => {
  const cart = getCartById(cartId);

  await addToCart(cart, sku, quantity);

  return cart;
};

const addToCart = async (cart: Cart, sku: string, quantity: number) => {
  if (await inventoryService.takeItem(sku, quantity)) {
    const price = inventoryService.getProductPrice(sku);
    cart.addToCart(sku, quantity, price);
  }
};

export const updateCartById = async (cartId: string, sku: string, quantity: number): Promise<Cart> => {
  const cart = getCartById(cartId);
  const items = cart.items;

  let currentQty = 0;
  let i = items.length;
  while (--i >= 0) {
    if (items[i].sku === sku) {
      if (++currentQty > quantity) {
        cart.removeItemAt(i);
      }
    }
  }

  const extras = currentQty - quantity;
  if (extras > 0) {
    await inventoryService.returnItem(sku, extras);
    resetPrices(cart);
  } else if (extras < 0) {
    await addToCart(cart, sku, -extras);
  }

  console.info('updated cart:', cart);

  return cart;
};

const resetPrices = (cart: Cart) => {
  const prices: { [sku: string]: number } = {};

  for (const item of cart.items) {
    const sku = item.sku;
    let price = prices[sku];
    if (price === undefined) {
      price = inventoryService.getProductPrice(sku);
      prices[sku] = price;
    }

    if (item.price !== price) {
      console.info('resetting price of', sku);
      item.price = price;
      delete item.discounted;
    }
  }
};
