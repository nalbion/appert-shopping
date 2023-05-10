import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import inventoryService from './inventory-service';
import Product from '../models/product';
import { ErrorResponse } from '../models/error';

chai.use(chaiAsPromised);

describe('InventoryService', () => {
  it('should take an in-stock item', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);

    // When
    const taken = await inventoryService.takeItem('120P90');

    // Then
    expect(taken).to.be.true;
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(9);
  });

  it('should not take more items than are in stock', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);

    // When
    const taken = await inventoryService.takeItem('120P90', 11);

    // Then
    expect(taken).to.be.false;
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(10);
  });

  it('should not take an unknown item', async () => {
    await expect(inventoryService.takeItem('unknown')).to.eventually.be.rejectedWith(ErrorResponse);
  });

  it('should return an item to stock', async () => {
    // Given
    inventoryService.setProductQuantity(new Product('120P90', 'Google Home', 49.99), 10);

    // When
    await inventoryService.returnItem('120P90');

    // Then
    expect(inventoryService.getProductQuantityInStock('120P90')).to.equal(11);
  });

  it('should not allow an unknown item to be returned', async () => {
    // When
    await expect(inventoryService.returnItem('unknown')).to.eventually.be.rejectedWith('Not Found');
  });
});
