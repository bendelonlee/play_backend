exports.seed = function(knex, Promise) {
  return knex('playlists').del()
    .then(function () {
      return Promise.all([
        knex('playlists').insert({"title": "Playlist 1"}),
        knex('playlists').insert({"title": "Playlist 2"})
      ]);
    });
};
