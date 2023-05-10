import Product from '../models/product';
import { ErrorResponse } from '../models/error';

class InventoryService {
  private inventory: { [sku: string]: { product: Product; inStock: number } } = {};

  /** This is not a production-friendly API, but it makes this challenge code cleaner */
  setProductQuantity(product: Product, inStock: number) {
    this.inventory[product.sku] = { product, inStock };
  }

  getProduct(sku: string) {
    const record = this.inventory[sku];

    if (!record) {
      throw new ErrorResponse(404, 'Not Found');
    }

    return record.product;
  }

  getProductQuantityInStock(sku: string) {
    if (!this.inventory[sku]) {
      throw new ErrorResponse(404, 'Not Found');
    }

    return this.inventory[sku].inStock;
  }

  // TODO: take/returnItem needs to be an atomic DB operation
  async takeItem(sku: string, quantity = 1): Promise<boolean> {
    const inStock = this.getProductQuantityInStock(sku);
    let taken = false;

    if (inStock >= quantity) {
      const newQty = inStock - quantity;
      this.inventory[sku].inStock = newQty;
      console.info(`${quantity} x ${sku} taken from stock, leaving ${newQty}`);
      taken = true;
    } else {
      console.info(`can not take ${quantity} x ${sku}, there are only ${inStock}`);
    }

    return taken;
  }

  async returnItem(sku: string, quantity = 1): Promise<void> {
    const inStock = this.getProductQuantityInStock(sku);
    const newQty = inStock + quantity;
    this.inventory[sku].inStock = newQty;
    console.info(`${quantity} x ${sku} returned to stock, leaving ${newQty}`);
  }
}

const inventoryService = new InventoryService();

// TODO: load from DB
inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);
inventoryService.setProductQuantity(new Product('43N23P', 'MacBook Pro', 5399.99), 5);
inventoryService.setProductQuantity(new Product('A304SD', 'Alexa Speaker', 109.5), 10);
inventoryService.setProductQuantity(new Product('234234', 'Raspberry Pi B', 30.0), 2);

export default inventoryService;
