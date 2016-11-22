'use strict';

const app = require('./index');

app({ port: 3000, debug: process.env.NODE_ENV === 'development' });
