const express = require('express');
const mongoose = require('mongoose');
const config = require('./src/config');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
var rateLimit = require('express-rate-limit');

const User = require('./src/models/User');

// user docker?
var rjwt = require('express-jwt');
const Zoo = require('./src/models/Zoo');

const server = express();

const mongodb_url =  'mongodb+srv://testDB:ZHbvnOhBwSubm3uH@cluster0.kujwk.mongodb.net/testDataBase?retryWrites=true&w=majority';

const port = 5000;
const port_https = 443;

// api request limiter
var apiLimiter = new rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 1000,
});
server.use('/api/', apiLimiter);

// create account limiter
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});
server.use('/api/userignup', createAccountLimiter);

server.use(bodyParser.json());

server.listen(port, () => { 
  mongoose.set('useFindAndModify', false);
  mongoose.connect(mongodb_url, {useNewUrlParser: true} );
  console.log(`Server running on port ${port}` );
});

const db  = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
  require('./src/routes/users')(server);
  require('./src/routes/zoos')(server);
})
