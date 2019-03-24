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

      expect(res.body[0].id).to.eq(1);
      expect(res.body[0].title).to.eq("playlist1");
      expect(res.body[0].favorites[0].id).to.eq(1);
      expect(res.body[0].favorites[0].name).to.eq('song1');
      expect(res.body[0].favorites[0].artist_name).to.eq('artist1');
      expect(res.body[0].favorites[0].genre).to.eq('genre1');
      expect(res.body[0].favorites[0].rating).to.eq(1);

      expect(res.body[1].id).to.eq(2);
      expect(res.body[1].title).to.eq("playlist2");
      expect(res.body[1].favorites[0].id).to.eq(2);
      expect(res.body[1].favorites[0].name).to.eq('song2');
      expect(res.body[1].favorites[0].artist_name).to.eq('artist2');
      expect(res.body[1].favorites[0].genre).to.eq('genre2');
      expect(res.body[1].favorites[0].rating).to.eq(2);

      expect(res.body[2].id).to.eq(3);
      expect(res.body[2].title).to.eq("playlist3");
      expect(res.body[2].favorites[0].id).to.eq(3);
      expect(res.body[2].favorites[0].name).to.eq('song3');
      expect(res.body[2].favorites[0].artist_name).to.eq('artist3');
      expect(res.body[2].favorites[0].genre).to.eq('genre3');
      expect(res.body[2].favorites[0].rating).to.eq(3);

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
