const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../index').app;
const db = require('knex')(require('../knexfile')['development']);


describe("Favorites Endpoints", () => {
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

  it("GET /api/v1/favorites", (done) => {
    chai.request(app)
    .get('/api/v1/favorites')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      expect(res.body[0].id).to.eq(1);
      expect(res.body[0].name).to.eq("We Will Rock You");
      expect(res.body[0].artist_name).to.eq("Queen");
      expect(res.body[0].genre).to.eq("Rock");
      expect(res.body[0].rating).to.eq(88);

      expect(res.body[1].id).to.eq(2);
      expect(res.body[1].name).to.eq("Bohemian Rhapsody");
      expect(res.body[1].artist_name).to.eq("Queen");
      expect(res.body[1].genre).to.eq("Rock");
      expect(res.body[1].rating).to.eq(66);

      done();
    });

    it("GET /api/v1/favorites", (done) => {
      chai.request(app)
      .get('/api/v1/favorites')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        expect(res.body[0].id).to.eq(1);
        expect(res.body[0].name).to.eq("We Will Rock You");
        expect(res.body[0].artist_name).to.eq("Queen");
        expect(res.body[0].genre).to.eq("Rock");
        expect(res.body[0].rating).to.eq(88);

        expect(res.body[1].id).to.eq(2);
        expect(res.body[1].name).to.eq("Bohemian Rhapsody");
        expect(res.body[1].artist_name).to.eq("Queen");
        expect(res.body[1].genre).to.eq("Rock");
        expect(res.body[1].rating).to.eq(66);

        done();
      });
  });
});
