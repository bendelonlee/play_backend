const Playlist = require('../models/playlist')

const index = (request, response) => {
  Playlist.all()
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
}

module.exports = {
  index
}
