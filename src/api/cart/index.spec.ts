import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';

const app = chai.use(chaiHttp);

describe('/api/cart', () => {
  before(() => {
    app.request(server).keepOpen();
  });

  after(() => {
    server.close();
  });

  describe('GET /api/cart', () => {
    it('should return "OK" on success', (done) => {
      app
        .request(server)
        .get('/api/cart')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
