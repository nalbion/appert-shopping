import Cart from '../models/cart';

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

  applyToCart(cart: Cart) {
    console.info('------ Applying promotions to cart:', cart.items);
    cart.promotionsApplied = [];

    for (const promotion of this.promotions) {
      promotion(cart);
    }

    if (cart.promotionsApplied.length > 0) {
      console.info(`Applied ${cart.promotionsApplied.length} promotion(s) to cart:`, cart.promotionsApplied, cart.items);
    }
  }
}

const promotionsService = new PromotionsService();

promotionsService.registerPromotionType('freebie', (description: string, purchaseSku: string, freeSku: string, cart: Cart) => {
  // console.info(`---- Promotion: ${description}`);
  const items = cart.items;
  let applied = false;
  let extraFreebies = 0;

  for (const item of items) {
    if (item.sku === purchaseSku) {
      console.debug(`Purchase of ${item.sku} qualifies for free ${freeSku}`);
      let granted = false;
      applied = true;

      for (const other of items) {
        if (other.sku === freeSku && other.price != 0) {
          console.debug(' this one is free');
          other.price = 0;
          other.discounted = true;
          granted = true;
        }
      }

      if (!granted) {
        extraFreebies++;
      }
    }
  }

  while (extraFreebies-- != 0) {
    console.info(' adding a free', freeSku);
    items.push({ sku: freeSku, price: 0, discounted: true });
  }

  if (applied) {
    cart.promotionsApplied.push(description);
  }
});

/** eg: Buy 3 Google Homes for the price of 2 */
promotionsService.registerPromotionType(
  'buy-x-for-y',
  (description: string, purchaseSku: string, getX: number, forPriceOfY: number, cart: Cart) => {
    // console.info(`---- Promotion: ${description}`);
    let count = 0;
    const items = cart.items;
    let applied = false;
    let discounts = 0;

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
        }
      }
    }

    while (discounts-- != 0) {
      console.info(' adding a free', purchaseSku);
      applied = true;
      items.push({ sku: purchaseSku, price: 0, discounted: true });
    }

    if (applied) {
      cart.promotionsApplied.push(description);
    }
  }
);

promotionsService.registerPromotionType(
  'buy-x-discounted',
  (description: string, purchaseSku: string, buyX: number, discountRate: number, cart: Cart) => {
    // console.info(`---- Promotion: ${description}`);
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
