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

  it("POST /api/v1/playlists/:playlist_id/favorites/:favorite_id", (done) => {
    chai.request(app)
    .post('/api/v1/playlists/1/favorites/2')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(201);

      expect(res.body.message).to.eq('Successfully added song2 to playlist1');
      done();
    });
  })

  it("DELETE /api/v1/playlists/:playlist_id/favorites/:favorite_id", (done) => {
    chai.request(app)
    .delete('/api/v1/playlists/1/favorites/1')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      
      expect(res.body.message).to.eq('Successfully removed song1 to playlist1');
      done();
    });
  })

  it("GET /api/v1/playlists/:id/favorites", (done) => {
    chai.request(app)
    .get('/api/v1/playlists/1/favorites')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);

      expect(res.body).to.be.a('array');

      res.body.forEach((favorite) => {
        expect(favorite).to.have.property('id')
        expect(favorite).to.have.property('name')
        expect(favorite).to.have.property('artist_name')
        expect(favorite).to.have.property('genre')
        expect(favorite).to.have.property('rating')
      });
      done();
    });
  })
});
