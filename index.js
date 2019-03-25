const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const Favorite = require('./lib/models/favorite');
// const Playlist = require('./lib/models/playlist');

const favoritesRoutes = require('./lib/routes/favorites');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play Backend';

const favorite_allowed_props = ['name', 'artist_name', 'genre', 'rating'];

function handleError(error, response) {
  console.log(error)
  response.status(500).json({ error });
}

app.use('/api/v1/favorites', favoritesRoutes);

app.get('/api/v1/favorites/:id', (request, response) => {
  Favorite.find(request.params.id)
    .then((favorite) => {
      response.status(200).json(favorite);
    })
    .catch((error) => handleError(error, response));
});

app.post('/api/v1/favorites', (request, response) => {
  const favorite = request.body;

  var missing = [];

  for (let requiredParameter of favorite_allowed_props) {
    if (!favorite_allowed_props.includes(requiredParameter)) {
      missing.push(requiredParameter);
    }
  }

  if (missing.length > 0) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <String>, rating: <Integer> }. You're missing "${missing.join(', ')}" properties.` });
  }

  Favorite.create(favorite)
    .then(favorite => {
      response.status(201).json(favorite[0]);
    })
    .catch((error) => handleError(error, response));
});

app.put('/api/v1/favorites/:id', (request, response) => {
  const favorite = request.body

  for(var prop of Object.keys(favorite)) {
    if(!favorite_allowed_props.includes(prop)) {
      response.status(400).json({"error": `"${prop}" is not a valid, updatable property for "favorite".`})
    }
  }

  Favorite.update(request.params.id, favorite)
    .then(favorite => {
      response.status(200).json(favorite[0]);
    })
    .catch((error) => handleError(error, response));
});

app.delete('/api/v1/favorites/:id', (request, response) => {
  Favorite.del(request.params.id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => handleError(error, response));
});

app.get('/api/v1/playlists', (request, response) => {
  database('playlists')
  .innerJoin('playlists_favorites', 'playlists.id', 'playlists_favorites.playlist_id')
  .innerJoin('favorites', 'favorites.id', 'playlists_favorites.favorite_id')
  .select(['playlists.id', 'playlists.title', database.raw("JSON_AGG(favorites) as favorites")])
  .groupBy('playlists.id', 'playlists_favorites.id', 'favorites.id')
  .then(playlists => {
    playlists.forEach(e => {
      e.favorites.forEach(fav => {
        delete fav.created_at;
        delete fav.updated_at;
      });
    });
    response.status(200).json(playlists)
  })
  .catch((error) => handleError(error, response));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports.app = app
