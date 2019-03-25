const newFavorites = [
  {name: 'song1', artist_name: 'artist1', genre: 'genre1', rating: 1},
  {name: 'song2', artist_name: 'artist2', genre: 'genre2', rating: 2},
  {name: 'song3', artist_name: 'artist3', genre: 'genre3', rating: 3}
]

const newPlaylists = [
    {title: 'playlist1'},
    {title: 'playlist2'},
    {title: 'playlist3'}
]

exports.seed = (knex, Promise) => {
  return knex('playlists_favorites').del()
  .then(() => knex('playlists').del())
  .then(() => knex('favorites').del())
  .then(() => {
    return Promise.all([
      knex('favorites').insert(newFavorites,'id')
      .then((favorites) => {
        return knex('playlists').insert(newPlaylists, 'id')
        .then((playlists) => {
          return knex('playlists_favorites').insert([
            {playlist_id: playlists[0], favorite_id: favorites[0]},
            {playlist_id: playlists[1], favorite_id: favorites[1]},
            {playlist_id: playlists[2], favorite_id: favorites[2]}
          ]);
        })
      }),
    ])
  });
};
