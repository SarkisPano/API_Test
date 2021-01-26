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

// test path
server.get('/api/test', (req, res) => {

  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});

/******************************* My API implementation ****************************************/
/**********************************************************************************************/

// GET for Objetc zoo
/*server.get('/api/zoo/:id', (req, res) => {
  
  let id = req.params.id;

  for (let i = 0; i < zoos.length; i++) {   
    if (zoos[i].id == id) {
      res.json(zoos[i]);    
    }
  }
});

// POST for Objetc zoo
server.post('/api/zoo', (req, res) => {
  
  const { name, director, employers, animals } = req.body;

  const zoo = new Zoo({
    name: name,
    director: director,
    employers: employers,
    animals: animals,
  });

  zoo.save();

  res.json(`Se creó el nuevo zoo`);

});

// PUT for Objetc zoo
server.put('/api/zoo/:id', (req, res) => {

  const { name, director, employers, animals } = req.body;
  
  //buscar en el array por id y modificar los datos

  if (name != undefined & name != zoo.name) {
    zoo.name = name;
    res.json(`Name changed to ${name}`);
  }

  if (director != undefined & director != zoo.director) {
    zoo.director = director;
    res.json(`Director changed to ${director}`);  
  }

  if (employers != undefined & employers != zoo.employers) {
    zoo.employers = employers;
    res.json(`Director changed to ${employers}`);  
  }

  if (animals != undefined & animals != zoo.animals) {
    zoo.animals = animals;
    res.json(`Director changed to ${animals}`);  
  }

  res.json('No changes');


});

// DELETE for Objetc zoo
server.delete('/api/zoo/:id', async (req, res) => {

  let id = req.params.id;

  for (let i = 0; i < zoos.length; i++) {   
    if (zoos[i].id == id) {
      let namecopy = zoo.name;
      zoo.name = undefined;
      zoo.director = undefined;
      zoo.employers = undefined;
      zoo.animals = undefined;
      res.json(`The Zoo ${namecopy} was deleted.`);
    }
  }

  res.json(`The Zoo dont exist.`);
  
});*/




/**********************************************************************************************/
/**********************************************************************************************/




// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzM4ZjdjZDVlNDMyMzA2Y2NjNzY3MTMiLCJ1c2VySWQiOiJhZG1pbjIxIiwiZW1haWwiOiJhZG1pbjFAYWRtaW4uY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkS3ZqOHdWYVNGTlVkdmZCa01GdmtYTzQ0aHZqZWZRV2pQbjVRYjhFT0ZiOU96eEZFMW5IT1ciLCJ1cGRhdGVkQXQiOiIyMDE5LTAxLTExVDIwOjA4OjQ1Ljg3OVoiLCJjcmVhdGVkQXQiOiIyMDE5LTAxLTExVDIwOjA4OjQ1Ljg3OVoiLCJfX3YiOjAsImlhdCI6MTU0NzI0MjYyN30.-Odftt28G4TxFHXsk-5t8t474geHoAm6RjdPJv92oTo
//server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/api/auth', 'api/signupUser']} ));

//const httpsOptions = {
//  key: fs.readFileSync('ssl/server.key'),
//  cert: fs.readFileSync('ssl/server.crt')
//};  

//https.createServer(httpsOptions, server)
//  .listen(port_https, function ( ) {
//    console.log(`Server running on port ${port_https}` );
//});

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
