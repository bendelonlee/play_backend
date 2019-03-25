const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const Playlist = require('./lib/models/playlist');

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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports.app = app
