const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const client = require('./client');  // not here

//require the database model
const UserController = require('./userController');

const app = express();

app.use(function (req, res, next) {
    // allow for Cross Origin Resource Sharing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));



// app.post('/register', (req, res) => {
//     //registerId()
//     //res.status(200).send();
//     //else res.status(401).send('Invalid authentication credentials');
// });
app.get('/', (req, res) => {
    res.status(200).send("Welcome to SpeakEasy.io");
});

// Sender/Client register's their identity and keyBundle with the server
app.post('/register', (req, res) => {
    // Receive PreKey Bundle
    
    // -------------- TEST -------------------- 
    // attach test key bundle to req.body 
    req.body.keyBundle = {
        key_bundle: {
            registrationId: {
                type: 111
            },
            identityKey: {
                type: new Int32Array(new ArrayBuffer(8))
            },
            signedPreKey: {
                keyId: {
                    type: 222
                },
                publicKey: {
                    type: new Int32Array(new ArrayBuffer(8))
                },
                signature: {
                    type: new Int32Array(new ArrayBuffer(8))
                }
            },
            preKey: {
                keyId: {
                    type: 333
                },
                publicKey: {
                    type: new Int32Array(new ArrayBuffer(8))
                }
            }
        },
        last_time_connected: {
            last_time: {
                type: Date.now()
            },
            last_message: {
                type: new Int32Array(new ArrayBuffer(8))
            }
        }
    }

    // call UserController.saveIdentity passing req and res 
    UserController.saveIdentity(req, res);


});

// Sender requests receiver's preKey Bundle 
app.get('/connect', (req, res, next) => {
    // Send Receiver's Pre-Key Bundle 
});

// Receive shared secret 
app.get('/session', (req, res, next) => {

});

// Send shared secret (message)
app.post('/session', )

app.listen(3030, () => {
    console.log('Listening on port 3000!');
});