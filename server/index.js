'use strict';

const path = require('path');
const peer = require('peer');
const express = require('express');

module.exports = ({ port }) => {
  const app = express();

  app.use('/', express.static(path.resolve(__dirname, '../client')));
  app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')));

  const server = app.listen(port);

  app.use('/peer', peer.ExpressPeerServer(server, {}));

  return app;
};
