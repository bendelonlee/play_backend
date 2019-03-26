const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (favorite_id, playlist_id) => {
  return database('playlists_favorites')
  .innerJoin('favorites', 'favorites.id', 'playlists_favorites.favorite_id')
  .innerJoin('playlists', 'playlists.id', 'playlists_favorites.playlist_id')
  .insert({"favorite_id": favorite_id, "playlist_id": playlist_id}, ['playlist_id', 'favorite_id'])
}

const del = (favorite_id, playlist_id) => {
  return database('playlists_favorites')
  .where('favorite_id', favorite_id)
  .where('playlist_id', playlist_id)
  .del()
}

module.exports = {
  create,
  del
}
