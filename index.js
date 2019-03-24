const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play Backend';

app.get('/api/v1/favorites', (request, response) => {
  database('favorites').select()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).select()
    .then((favorite) => {
      response.status(200).json(favorite);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/favorites', (request, response) => {
  const favorite = request.body;

  var missing = [];

  for (let requiredParameter of ['name', 'artist_name', 'genre', 'rating']) {
    if (!favorite[requiredParameter]) {
      missing.push(requiredParameter);
    }
  }

  if (missing.length > 0) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <String>, rating: <Integer> }. You're missing "${missing.join(', ')}" properties.` });
  }

  database('favorites').insert(favorite, ['id'])
    .then(favorite => {
      response.status(201).json(favorite[0])
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).del()
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
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
  .catch((error) => {
    console.log(error);
    response.status(500).json({ error });
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports.app = app
