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
            // res.sendStatus(200) respuesta automatica
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    // get single zoo data
    server.get('/api/zoos/:id', async (req, res) => {
        try {
            const zoo = await Zoo.findById(req.params.id, (err) => {
                if(err){
                    res.sendStatus(404);
                }
            });
            res.json(zoo);           
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    // add zoo
    server.post('/api/zoos', async (req, res) => {
        if(req.is('application/json')){

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
                res.status(201).json(newZoo);
            } catch(err) {
                console.log(err);
                res.sendStatus(500);
            }
        } else {
            res.status(400).json({
                message: 'You only can send JSON request',
            });
        }
    });

    // update zoo
    server.put('/api/zoos/:id', async (req, res) => {
        if(req.is('application/json')){
            try {
                const chagedZoo = await Zoo.findOneAndUpdate({_id: req.params.id}, req.body, (err) => {
                    if(err){
                        res.sendStatus(404);
                    }
                } );
                res.status(200).json(chagedZoo);
            } catch(err) {
                res.sendStatus(500);
            }
        } else {
            res.status(400).json({
                message: 'You only can send JSON request',
            });
        }
    });

    // delete zoo
    server.delete('/api/zoos/:id', async (req, res) => {
        try {
            const zoo = await Zoo.findById(req.params.id, async (err) => {
                if(err){
                    res.sendStatus(404);
                } else {
                    const deletedZoo = await Zoo.deleteOne({_id: req.params.id});
                    res.sendStatus(204);
                }
            });
        } catch(err) {
            res.sendStatus(500);
        }
    });

}