const express = require('express');
const router  = express.Router();
const playlistsController = require('../controllers/playlists');
const playlistsFavoritesController = require('../controllers/playlists_favorites');

router.get('/', playlistsController.index);
router.get('/:id/favorites', playlistsFavoritesController.index);

router.post('/:playlist_id/favorites/:favorite_id', playlistsFavoritesController.create);

module.exports = router
