const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../index').app;
const db = require('knex')(require('../knexfile')['development']);

describe("Favorites Endpoints", () => {
  before((done) => {
    db.raw("TRUNCATE favorites RESTART IDENTITY CASCADE;")
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
      expect(res.body[0].name).to.eq("song1");
      expect(res.body[0].artist_name).to.eq("artist1");
      expect(res.body[0].genre).to.eq("genre1");
      expect(res.body[0].rating).to.eq(1);

      expect(res.body[1].id).to.eq(2);
      expect(res.body[1].name).to.eq("song2");
      expect(res.body[1].artist_name).to.eq("artist2");
      expect(res.body[1].genre).to.eq("genre2");
      expect(res.body[1].rating).to.eq(2);

      done();
    });
  });

  it("GET /api/v1/favorites/:id", (done) => {
    chai.request(app)
    .get('/api/v1/favorites/1')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      expect(res.body[0].id).to.eq(1);
      expect(res.body[0].name).to.eq("song1");
      expect(res.body[0].artist_name).to.eq("artist1");
      expect(res.body[0].genre).to.eq("genre1");
      expect(res.body[0].rating).to.eq(1);

      done();
    });
  });

  it("POST /api/v1/favorites/", (done) => {
    var new_fav = {
      "name": "Test Song",
      "artist_name": "Test Artist",
      "genre": "Test Genre",
      "rating": 75
    }

    chai.request(app)
    .post('/api/v1/favorites/')
    .send(new_fav)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(201);
      expect(res).to.be.json;

      expect(res.body).to.have.property('id');

      done();
    });
  });

  it("PUT /api/v1/favorites/:id", (done) => {
    chai.request(app)
    .put('/api/v1/favorites/2')
    .send({"name":"Test Update"})
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body.name).to.eq("Test Update");

      done();
    });
  });

  it("DELETE /api/v1/favorites/:id", (done) => {
    chai.request(app)
    .delete('/api/v1/favorites/2')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(204);
      
      done();
    });
  });
});
