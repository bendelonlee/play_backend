const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => {
  return database('playlists')
    .innerJoin('playlists_favorites', 'playlists.id', 'playlists_favorites.playlist_id')
    .innerJoin('favorites', 'favorites.id', 'playlists_favorites.favorite_id')
    .select(['playlists.id', 'playlists.title', database.raw("JSON_AGG(favorites) as favorites")])
    .groupBy('playlists.id', 'playlists_favorites.id', 'favorites.id');
}

const find = (id) => database('playlists').where('id', id).select();

module.exports = {
  all,
  find
}
