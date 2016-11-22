'use strict';

const path = require('path');
const peer = require('peer');
const express = require('express');

module.exports = (options) => {
  peer.PeerServer({ port: 9000, path: '/peerjs' });

  const app = express();

  app.use('/', express.static(path.resolve(__dirname, '../client')));
  app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')));

  return app;
};
