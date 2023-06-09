import Cart from '../models/cart';
import inventoryService from './inventory-service';

type PromotionHandler = (...args: Array<never>) => void;

class PromotionsService {
  private handlers: { [type: string]: PromotionHandler } = {};
  private promotions: Array<(cart: Cart, ...args: Array<string | number>) => void> = [];

  registerPromotionType(type: string, handler: PromotionHandler) {
    this.handlers[type] = handler;
  }

  configurePromotion(type: string, description: string, ...args: Array<string | number>) {
    console.info('Promotion activated:', description);
    const promotion = this.handlers[type].bind(null, description as never, ...(args as never[])) as never;
    this.promotions.push(promotion);
  }

  async applyToCart(cart: Cart) {
    console.info('------ Applying promotions to cart:', cart.items);
    cart.promotionsApplied = [];

    for (const promotion of this.promotions) {
      await promotion(cart);
    }

    if (cart.promotionsApplied.length > 0) {
      console.info(`Applied ${cart.promotionsApplied.length} promotion(s) to cart:`, cart.promotionsApplied, cart.items);
    }
  }
}

const promotionsService = new PromotionsService();

promotionsService.registerPromotionType('freebie', async (description: string, purchaseSku: string, freeSku: string, cart: Cart) => {
  console.info(`---- Promotion: ${description}`);
  const items = cart.items;
  let applied = false;
  let extraFreebies = 0;
  let freeIndex = 0;

  for (const item of items) {
    if (item.sku === purchaseSku) {
      console.debug(`Purchase of ${item.sku} qualifies for free ${freeSku}`);
      let granted = false;
      applied = true;

      while (freeIndex < items.length) {
        const other = items[freeIndex++];

        if (other.sku === freeSku) {
          console.debug(' this one is free');
          other.price = 0;
          other.discounted = true;
          granted = true;
          break;
        }
      }

      if (!granted) {
        extraFreebies++;
      }
    }
  }

  if (extraFreebies != 0) {
    const { name } = inventoryService.getProduct(freeSku);

    while (extraFreebies-- != 0) {
      const available = await inventoryService.takeItem(freeSku, 1);
      if (available) {
        console.info(` adding a free ${name} (${freeSku})`);
        items.push({ sku: freeSku, name, price: 0, discounted: true });
      } else {
        console.info(` free ${freeSku} is not in stock`);
      }
    }
  }

  if (applied) {
    cart.promotionsApplied.push(description);
  }
});

/** eg: Buy 3 Google Homes for the price of 2 */
promotionsService.registerPromotionType(
  'buy-x-for-y',
  async (description: string, purchaseSku: string, getX: number, forPriceOfY: number, cart: Cart) => {
    console.info(`---- Promotion: ${description}`);
    let count = 0;
    const items = cart.items;
    let applied = false;
    let discounts = 0;
    let name = '';

    for (const item of items) {
      if (item.sku == purchaseSku) {
        if (discounts) {
          console.info(' this one is free', purchaseSku);
          item.price = 0;
          item.discounted = true;
          applied = true;
          discounts--;
        } else if (++count == forPriceOfY) {
          discounts = getX - forPriceOfY;
          count = 0;
          name = item.name;
        }
      }
    }

    while (discounts-- != 0) {
      const available = await inventoryService.takeItem(purchaseSku, 1);
      if (available) {
        console.info(' adding a free', purchaseSku);
        items.push({ sku: purchaseSku, name, price: 0, discounted: true });
        applied = true;
      } else {
        console.info(` free ${purchaseSku} is not in stock`);
      }
    }

    if (applied) {
      cart.promotionsApplied.push(description);
    }
  }
);

promotionsService.registerPromotionType(
  'buy-x-discounted',
  (description: string, purchaseSku: string, buyX: number, discountRate: number, cart: Cart) => {
    console.info(`---- Promotion: ${description}`);
    const eligibleItems = cart.items.filter((item) => item.sku === purchaseSku);

    if (eligibleItems.length >= buyX) {
      const discountedPrice = eligibleItems[0].price * (1 - discountRate);

      for (const item of eligibleItems) {
        item.price = discountedPrice;
        item.discounted = true;
      }

      cart.promotionsApplied.push(description);
    }
  }
);

promotionsService.configurePromotion('freebie', 'Free Raspberry Pi B with MacBook Pro purchase', '43N23P', '234234');
promotionsService.configurePromotion('buy-x-for-y', '3 Google Homes for the price of 2', '120P90', 3, 2);
promotionsService.configurePromotion('buy-x-discounted', 'Alexa Speaker bulk discount', 'A304SD', 4, 0.1);

export default promotionsService;
