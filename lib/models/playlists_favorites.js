const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);


const create = (favorite_id, playlist_id) => {
  database('playlists_favorites').insert({favorite}, ['id'])
}
