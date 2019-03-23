const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play Backend';

const favorite_allowed_props = ['name', 'artist_name', 'genre', 'rating'];

app.get('/api/v1/favorites', (request, response) => {
  database('favorites').select()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).select()
    .then((favorite) => {
      response.status(200).json(favorite);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/favorites', (request, response) => {
  const favorite = request.body;

  var missing = [];

  for (let requiredParameter of favorite_allowed_props) {
    if (!favorite_allowed_props.includes(requiredParameter)) {
      missing.push(requiredParameter);
    }
  }

  if (missing.length > 0) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <String>, rating: <Integer> }. You're missing "${missing.join(', ')}" properties.` });
  }

  database('favorites').insert(favorite, ['id'])
    .then(favorite => {
      response.status(201).json(favorite[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.put('/api/v1/favorites/:id', (request, response) => {
  const favorite = request.body

  for(var prop of Object.keys(favorite)) {
    if(!favorite_allowed_props.includes(prop)) {
      response.status(400).json({"error": `"${prop}" is not a valid, updatable property for "favorite".`})
    }
  }

  database('favorites').where('id', request.params.id).update(favorite, ['name', 'artist_name', 'genre', 'rating'])
    .then(favorite => {
      response.status(200).json(favorite[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).del()
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports.app = app
