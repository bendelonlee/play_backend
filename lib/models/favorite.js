const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const ALLOWED_PROPS = ['name', 'artist_name', 'genre', 'rating'];

const all = () => database('favorites').select();
const find = (id) => database('favorites').where('id', id).select();
const create = (favorite) => database('favorites').insert(favorite, ['id']);
const update = (id, favorite) => database('favorites').where('id', id).update(favorite, ['name', 'artist_name', 'genre', 'rating']);
const del = (id) => database('favorites').where('id', id).del();

module.exports = {
  ALLOWED_PROPS,
  all,
  find,
  create,
  update,
  del
}
