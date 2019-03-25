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
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      res.body.forEach((playlist) => {
        expect(playlist).to.have.property('id')
        expect(playlist).to.have.property('title')
        expect(playlist).to.have.property('favorites')
        expect(playlist.favorites).to.be.a('array');
      });
      done();
    });
  });
  //
  // it("GET /api/v1/playlists/:playlist_id/favorites", (done) => {
  //   chai.request(app)
  //   .get('/api/v1/playlists')
  //   .end((err, res) => {
  //     done();
  //   });
  // })
});
