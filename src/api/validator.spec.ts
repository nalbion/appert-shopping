import { expect } from 'chai';
import { validateModel } from './validator';

describe('validator', () => {
  it('validate update request', () => {
    const update = {
      sku: '120P90',
      quantity: 2,
    };

    expect(() => validateModel('CartUpdate', update)).to.not.throw();
  });

  it('validate invalid update request', () => {
    const update = {
      invalid: true,
    };

    expect(() => validateModel('CartUpdate', update)).to.throw('sku is a required field\n' + 'quantity is a required field');
  });

  it('validate request missing quantity', () => {
    const update = {
      sku: '120P90',
    };

    expect(() => validateModel('CartUpdate', update)).to.throw('quantity is a required field');
  });

  it('validate request missing sku', () => {
    const update = {
      quantity: 1,
    };

    expect(() => validateModel('CartUpdate', update)).to.throw('sku is a required field');
  });

  it('validate invalid sku', () => {
    const update = {
      sku: 1,
      quantity: 2,
    };

    expect(() => validateModel('CartUpdate', update)).to.throw('sku (1) is not a type of string');
  });

  it('validate invalid quantity', () => {
    const update = {
      sku: '120P90',
      quantity: '1',
    };

    expect(() => validateModel('CartUpdate', update)).to.throw('quantity (1) is not a type of number');
  });
});
