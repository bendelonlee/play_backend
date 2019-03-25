const Favorite = require('../models/favorite');

const index = (request, response) => {
  Favorite.all()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => handleError(error, response));
}

const show = (request, response) => {
  Favorite.find(request.params.id)
    .then((favorite) => {
      response.status(200).json(favorite);
    })
    .catch((error) => handleError(error, response));
}

const create = (request, response) => {
  const favorite = request.body;

  var missing = [];

  for (let requiredParameter of Favorite.ALLOWED_PROPS) {
    if (!Favorite.ALLOWED_PROPS.includes(requiredParameter)) {
      missing.push(requiredParameter);
    }
  }

  if (missing.length > 0) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <String>, rating: <Integer> }. You're missing "${missing.join(', ')}" properties.` });
  }

  Favorite.create(favorite)
    .then(favorite => {
      response.status(201).json(favorite[0]);
    })
    .catch((error) => handleError(error, response));
}

const update = (request, response) => {
  const favorite = request.body

  for(var prop of Object.keys(favorite)) {
    if(!Favorite.ALLOWED_PROPS.includes(prop)) {
      response.status(400).json({"error": `"${prop}" is not a valid, updatable property for "favorite".`})
    }
  }

  Favorite.update(request.params.id, favorite)
    .then(favorite => {
      response.status(200).json(favorite[0]);
    })
    .catch((error) => handleError(error, response));
}

const del = (request, response) => {
  Favorite.del(request.params.id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => handleError(error, response));
}

module.exports = {
  index,
  show,
  create,
  update,
  del
}
