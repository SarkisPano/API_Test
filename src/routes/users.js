const config = require('../config');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mail');
var rjwt = require('express-jwt');

//const redis = require('redis');

// create and connect redis client to local instance.
// windows redis: https://github.com/MicrosoftArchive/redis/releases
//const client = redis.createClient(6379, 'localhost');

module.exports = server => {
    // get all Users
    //rjwt({ secret: config.JWT_ACCESSSECRET })
    server.get('/api/users', async (req, res) => {
        try {
            const users = await User.find({});

            res.json(users);
        } catch(err) {
            console.log(err);
        }
    });

    // get single user data
    server.get('/api/users/:id', rjwt({ secret: config.JWT_ACCESSSECRET }), async (req, res) => {
        try {
            
            // REDIS part as test
            //client.get(req.params.id, function (err, reply) {
            //    if (err) callback(null);
            //    else if (reply) //Book exists in cache
            //   console.log(JSON.parse(reply));
            //});

            //TODO
            //protect this route
            //decode token and compare email
            var token = req.headers.authorization.split(" ");
            const tokenUser = "";
            if(token[1] != null){
                
            }
            let reply; // reply from redis
            if(reply != null) {
                console.log(reply);
                res.json(reply);
            } else {
                const user = await User.findById(req.params.id);
                client.set(req.params.id, JSON.stringify(user));
                res.json(user);
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(404);
        }
    });

    // add user
    // TODO hide this route
    server.post('/api/users', rjwt({ secret: config.JWT_ACCESSSECRET }), async (req, res) => {
        if(req.is('application/json')){
            // do something
            const { email, password, firstName, lastName } = req.body;

            const user = new User({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            });

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(user.password, salt, async (err,hash) =>{
                    //Hash pasword
                    user.password = hash;
                    // save user
                    try {
                        const newUser = await user.save();
                        res.sendStatus(201);
                    } catch(err) {
                        console.log(err);
                        res.sendStatus(400);
                    }
                })
            });
        } // else give error
    });

    // update user
    server.post('/api/users/:id', rjwt({ secret: config.JWT_ACCESSSECRET }), async (req, res) => {
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

    // delete user
    server.delete('/api/users/:id', rjwt({ secret: config.JWT_ACCESSSECRET }), async (req, res) => {
        try {
            //TODO
            // protect route and check token for the user
            const user = await User.findOneAndRemove({_id: req.params.id});
            res.sendStatus(204);
        } catch(err) {
            res.sendStatus(404);
        }
    });

    server.get('/api/verifyemail/:id', async (req, res, next) => {
        try {
            var verifyToken = req.params.id;
            jwt.verify(verifyToken, config.JWT_VERIFYSECRET ,function(err,token){
                if(err){
                    res.status(400).json({
                        message: 'Invalid verification id'
                    });
                    return;
                }           
            });

            const userFind = await User.findOne({verifyToken});
            
            const email  = jwt.decode(accessToken);
            //TODO
            //decode token and compare email of found user with token user

            if(userFind != null) {
                if( email == userFind.email ){
                    try {
                        userFind.active = true;
                        userFind.verifyToken = "";
                        const newUser = await userFind.save();
                        res.status(200).json({
                            message: 'User activated'
                        });
                    } catch(err) {
                        console.log(err);
                        res.sendStatus(400);
                    }
                } else {
                    res.status(400).json({
                        message: 'Invalid verification id'
                    });
                }
            } else {
                res.status(400).json({
                    message: 'Invalid verification id'
                });
            }
        } catch (err) {
            next(err);
        }            
    });

    // sigup User
    server.post('/api/usersignup', async (req, res, next) => {
        if(req.is('application/json')){

            // do something
            const { email, password, firstName, lastName } = req.body;

            // create verifytoken
            const verifyToken =  jwt.sign({ email , password }, config.JWT_VERIFYSECRET,{
                expiresIn: '30d' // 30 dagen
            });

            const user = new User({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                active: false,
                verifyToken: verifyToken,
            });
            mailer.sendWelcomEmail( user ) ;

            const userFind = await User.findOne({email});
            if( userFind == null ) { // user not found
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(user.password, salt, async (err,hash) =>{
                        //Hash pasword
                        user.password = hash;
                        // save user
                        try {
                            const newUser = await user.save();
                            res.sendStatus(201);
                        } catch(err) {
                            console.log(err);
                            res.sendStatus(400);
                        }
                    })
                });
            } else {
                res.status(400).json({
                    message: 'User already in use'
                });
            }
        } // else give error
    });

    // authenticate user
    server.post('/api/refreshToken', async (req, res, next ) => {
        if(req.is('application/json')){
            const  { email, refeshtoken }  = req.body;

            jwt.verify(refeshtoken, config.JWT_REFRESHSECRET ,function(err,token){
                if(err){
                    next(err);
                } else {
                    try {
                    // create access token
                    const accessToken =  jwt.sign(email, config.JWT_ACCESSSECRET,{
                        expiresIn: '1800s' // 30 min
                    });
                    res.send({iat, exp, accessToken, refeshtoken});
                    } catch(err) {
                        console.log(err);
                    }
                }          
            });
        }
    });

    // authenticate user
    server.post('/api/auth', async (req, res ) => {
        if(req.is('application/json')){
            const  { email, password }  = req.body;

            try {
                // authenticate
                const user = await auth.authenticate(email, password);

                // create access token
                const accessToken =  jwt.sign(user.toJSON(), config.JWT_ACCESSSECRET,{
                    expiresIn: '1800s' // 30 min
                });

                // create refresh token
                const refeshtoken =  jwt.sign(user.toJSON(), config.JWT_REFRESHSECRET,{
                    expiresIn: '15d' // 15d
                });

                var {iat, exp } = jwt.decode(accessToken);
                const accessiat = iat;
                const accesexp = exp;

                var { iat, exp }  = jwt.decode(refeshtoken);
                const refeshiat = iat ; 
                const refeshexp = exp ; 
                res.send({accessiat, accesexp, accessToken, refeshiat, refeshexp, refeshtoken});
                //next();
            } catch(err) {
                // user unauthorized
                res.status(401).json({
                    message: 'Authentication Failed'
                });
            }
        }
    });

}