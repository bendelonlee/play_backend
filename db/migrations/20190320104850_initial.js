
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('favorites', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('artist_name');
      table.string('genre');
      table.integer('rating');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('playlists', (table) => {
      table.increments('id').primary();
      table.string('title');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('playlists_favorites', (table) => {
      table.increments('id').primary();
      table.integer('favorite_id').references('favorites.id').onDelete('CASCADE');
      table.integer('playlist_id').references('playlists.id').onDelete('CASCADE');

      table.timestamps(true, true);
    })
  ]);
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('playlists_favorites'),
    knex.schema.dropTable('favorites'),
    knex.schema.dropTable('playlists')
  ]);
}
