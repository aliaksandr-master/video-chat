'use strict';

const http = require('http');
const app = require('./index')();

http.createServer(app).listen(3000);
