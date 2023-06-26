const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const api_endpoints = require('../api');

module.exports = (function initializeExpressServer() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/', api_endpoints);

  app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
  });

  return app;

}());
