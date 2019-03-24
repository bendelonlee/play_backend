const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../index').app;
const db = require('knex')(require('../knexfile')['development']);

describe("Playlists Endpoints", () => {
  before((done) => {
    db.raw("TRUNCATE playlists_favorites restart identity;")
    .then(() => db.raw("TRUNCATE playlists restart identity CASCADE;"))
    .then(() => db.raw("TRUNCATE favorites restart identity CASCADE;"))
    .then(() => done())
    .catch(error => { throw error; });
  });

  before((done) => {
    db.migrate.latest()
    .then(() => done())
    .catch(error => { throw error; });
  });

  before((done) => {
    db.seed.run()
    .then(() => done())
    .catch(error => { throw error; });
  });

  it("GET /api/v1/playlists", (done) => {
    chai.request(app)
    .get('/api/v1/playlists')
    .end((err, res) => {
      console.log(res.body)
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      expect(res.body[0].id).to.eq(1);
      expect(res.body[0].title).to.eq("playlist1");
      expect(res.body[0].favorites[0]).to.eq({});

      expect(res.body[1].id).to.eq(2);
      expect(res.body[1].title).to.eq("playlist2");

      done();
    });
  });
});
