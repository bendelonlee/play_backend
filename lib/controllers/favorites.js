const Favorite = require('../models/favorite');

const index = (request, response) => {
  Favorite.all()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => handleError(error, response));
}

module.exports = {
  index
}
