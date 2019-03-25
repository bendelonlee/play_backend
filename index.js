const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const favoritesRoutes = require('./lib/routes/favorites');
const playlistsRoutes = require('./lib/routes/playlists');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play Backend';

function handleError(error, response) {
  console.log(error)
  response.status(500).json({ error });
}

app.use('/api/v1/favorites', favoritesRoutes);

app.use('/api/v1/playlists', playlistsRoutes);

const favorite = require('./lib/models/favorite');
const playlist = require('./lib/models/playlist');

app.post('/api/v1/playlists/:playlist_id/favorites/:favorite_id', (request, response) => {
  database('playlists_favorites')
  .innerJoin('favorites', 'favorites.id', 'playlists_favorites.favorite_id')
  .innerJoin('playlists', 'playlists.id', 'playlists_favorites.playlist_id')
  .insert({"favorite_id": request.params.favorite_id, "playlist_id": request.params.playlist_id}, ['playlist_id', 'favorite_id'])
  .then(playlists_favorite => {
    return Promise.all([
      favorite.find(request.params.favorite_id),
      playlist.find(request.params.playlist_id)
    ]);
  })
  .then(objs => {
    response.status(201).json({"message": `Successfully added ${objs[0][0].name} to ${objs[1][0].title}`})
  })
  .catch(error => handleError(error, response));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports.app = app
