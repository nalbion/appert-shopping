import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';

const app = chai.use(chaiHttp);

describe('/health', () => {
  before(() => {
    app.request(server).keepOpen();
  });

  after(() => {
    server.close();
  });

  describe('GET /health', () => {
    it('should return "OK" on success', (done) => {
      app
        .request(server)
        .get('/api/health')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ version: '0.0.1' });
          done();
        });
    });
  });
});
