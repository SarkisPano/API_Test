const config = require('../config');
const User = require('../models/Zoo');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mail');
var rjwt = require('express-jwt');
const Zoo = require('../models/Zoo');


module.exports = server => {
    // get all Zoos
    server.get('/api/zoos', async (req, res) => {
        try {
            const zoos = await Zoo.find({});
            res.json(zoos);
        } catch(err) {
            console.log(err);
        }
        res.json("Anduvo bien");
    });

    // get single zoo data
    server.get('/api/zoos/:id', async (req, res) => {
        console.log("ADENTRO DEL GET");
        try {
            const zoo = await Zoo.findById(req.params.id);
            res.json(zoo);
            
        } catch(err) {
            console.log(err);
            res.sendStatus(404);
        }
    });


    // add zoo
    server.post('/api/zoos', async (req, res) => {
        if(req.is('application/json')){
            // do something
            const { name, director, employers, animals } = req.body;

            const zoo = new Zoo({
                name: name,
                director: director,
                employers: employers,
                animals: animals
            });

            // save zoo
            try {
                const newZoo = await zoo.save();
                res.sendStatus(201);
            } catch(err) {
                console.log(err);
                res.sendStatus(400);
            }
        }
    });

    // update zoo
    server.post('/api/zoos/:id', async (req, res) => {
        if(req.is('application/json')){
            try {
                //TODO
                // protect route and check token for the user
                const user = await User.findOneAndUpdate({_id: req.params.id}, req.body );
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(404);
            }
        } // else give error
    });

    // delete zoo
    server.delete('/api/zoos/:id', async (req, res) => {
        try {
            //TODO
            // protect route and check token for the zoo
            const user = await User.findOneAndRemove({_id: req.params.id});
            res.sendStatus(204);
        } catch(err) {
            res.sendStatus(404);
        }
    });

}