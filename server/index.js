'use strict';

const path = require('path');
const peer = require('peer');
const express = require('express');

const DIR_CLIENT = path.resolve(__dirname, '../client');
const DIR_NODE_MODULES = path.resolve(__dirname, '../node_modules');


peer.PeerServer({ port: 9000, path: '/peerjs' });

const app = express();

app.use('/', express.static(DIR_CLIENT));
app.use('/node_modules', express.static(DIR_NODE_MODULES));

const template = (path) => {
  delete require.cache[require.resolve(path)];

  return require(path);
};

app.listen(process.env.NODE_ENV === 'production' ? 80 : 3000);
