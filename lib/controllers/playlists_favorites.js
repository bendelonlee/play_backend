const PlaylistsFavorites = require('../models/playlists_favorites');
const Playlist = require('../models/playlist');
const Favorite = require('../models/favorite');

const create = (request, response) => {
  PlaylistsFavorites.create(request.params.favorite_id, request.params.playlist_id)
  .then(playlists_favorite => {
    return Promise.all([
      Favorite.find(request.params.favorite_id),
      Playlist.find(request.params.playlist_id)
    ]);
  })
  .then(objs => {
    response.status(201).json({"message": `Successfully added ${objs[0][0].name} to ${objs[1][0].title}`})
  })
  .catch(error => {
    console.log(error);
    response.status(500).json({error});
  });
}

const index = (request, response) => {
  Playlist.allFavorites(request.params.id)
  .then(favorites => response.status(200).json(favorites))
  .catch(error => {
    console.log(error);
    response.status(500).json({error});
  });
}

const del = (request, response) => {
  PlaylistsFavorites.del(request.params.favorite_id, request.params.playlist_id)
  .then(playlists_favorite => {
    return Promise.all([
      Favorite.find(request.params.favorite_id),
      Playlist.find(request.params.playlist_id)
    ]);
  })
  .then(objs => {
    response.status(200).json({"message": `Successfully removed ${objs[0][0].name} from ${objs[1][0].title}`})
  })
  .catch(error => {
    console.log(error);
    response.status(500).json({error});
  });
}

module.exports = {
  index,
  create,
  del
}
