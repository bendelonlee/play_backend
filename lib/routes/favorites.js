const express = require('express');
const router  = express.Router();
const favoritesController = require('../controllers/favorites')

router.get('/', favoritesController.index);
router.get('/:id', favoritesController.show);
router.post('/', favoritesController.create);
router.put('/:id', favoritesController.update);
router.delete('/:id', favoritesController.del);

module.exports = router
