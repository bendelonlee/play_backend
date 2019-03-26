# Play Backend [![Build Status](https://travis-ci.org/bendelonlee/play_backend.svg?branch=master)](https://travis-ci.org/bendelonlee/play_backend)

Play is a full-stack javascript playlist management app built using Express.js and Knex.js. This repository contains the backend API being accessed from the separate front end found [here](https://github.com/bendelonlee/playFrontend).

You can access the api here: https://play-backend.herokuapp.com/

## Installation

Clone down the repository and install all required node modules.

```bash
git clone https://github.com/bendelonlee/play_backend.git
cd play_backend
npm install
```

## Usage

### Running locally

All you have to do is run:

```bash
npm start
```

or

```bash
node ./index.js
```

### Running tests

To run the included test suite:

```bash
npm test
```

or 

```bash
mocha --exit test/
```
