const express = require('express');
const bodyParser = require('body-parser');
const api_endpoints = require('../api');

module.exports = (function initializeExpressServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use('/', does_method_exist, api_endpoints);
  app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
  });

  return app;

  function does_method_exist(req, res, next) {
    // TODO: What should this implementation look like?
    next();
  }
}());
