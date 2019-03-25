const express = require('express');
const router  = express.Router();
const playlistsController = require('../controllers/playlists')

router.get('/', playlistsController.index);

module.exports = router