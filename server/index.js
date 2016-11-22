'use strict';

const path = require('path');
const peer = require('peer');
const express = require('express');
const morgan = require('morgan');

module.exports = ({ port, debug = false }) => {
  const app = express();

  if (debug) {
    app.use(morgan('short'))
  }

  const template = (templatePath) => {
    delete require.cache[require.resolve(templatePath)];
    return require(templatePath);
  };

  app.use('/', express.static(path.resolve(__dirname, '../client')));

  app.get('/room/founder/:roomId', (req, res) => {
    res.send(template('./views/room.js')({ server: true, roomId: req.params.roomId }));
  });

  app.get('/room/affiliated/:roomId', (req, res) => {
    res.send(template('./views/room.js')({ server: false, roomId: req.params.roomId }));
  });

  app.get('/', (req, res) => {
    res.send(template('./views/index.js')({}));
  });

  const server = app.listen(port);

  app.use('/peer', peer.ExpressPeerServer(server, {}));

  return app;
};
