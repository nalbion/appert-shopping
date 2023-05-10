import { expect } from 'chai';
import { Context } from 'koa';
import healthCheck from './health-check';

const mockCtx = {} as Context;

describe('Route - healthCheck', () => {
  it('should return OK ', async () => {
    await healthCheck(mockCtx);
    expect(mockCtx).to.have.property('body');
    expect(mockCtx.body).to.deep.equal({ version: '0.0.1' });
  });
});
