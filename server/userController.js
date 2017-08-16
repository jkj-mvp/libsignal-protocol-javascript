const mongoose = require('mongoose');

const User = require('./userModel');


//Save Identity and Key Bundle in Database 
const saveIdentity = (req, res, next) => {
 
    const keyBundle = req.body; 
    // console.log("Our body is: ", req.body); 
    
    console.log("The type of type of key bundle is: ", typeof keyBundle);
    console.log("Our key bundle is ", keyBundle);

    // const senderRegId = req.body.keyBundle.registrationId; 
    // console.log("Our Sender Reg ID is: ", senderRegId); 

    //new Int32Array(new ArrayBuffer(8))

    User.create({
        "key_bundle": {
            "registrationId": keyBundle.key_bundle.registrationId,//6969
            "identityKey": keyBundle.key_bundle.identityKey,//"sdfjaspdfjasdfjsladf"
            "signedPreKey": {
                "keyId": keyBundle.key_bundle.signedPreKey.keyId, //222
                "publicKey": keyBundle.key_bundle.signedPreKey.keyId, // "dfasgSGAWGASGWRGVASGSA",// //
                "signature": keyBundle.key_bundle.signedPreKey.signature //"DGASGASGDAGSfasvvdrse5vvys6"
            },
            "preKey": {
                "keyId": keyBundle.key_bundle.preKey.keyId,//333
                "publicKey": keyBundle.key_bundle.preKey.publicKey,//"rtyc45vycw4vyc4s5yscg54"
            }

        },
        "last_time_connected": {
            "last_time": keyBundle.last_time_connected.last_time,//1502858453465
            "last_message": keyBundle.last_time_connected.last_message // "svrtdhd45vyrshcevdryh46rutbshe"
        }
    }, (err, doc) => {
        if (err) res.status(500).send("Could not register. Try again.");
        else res.status(200).send(doc)
    });
}

// Serve the Receiver's Key Bundle to Sender if found
const findIdentity = (req, res, next) => {

    // Extract Receiver's registration ID from req.body 
    const receiverRegId = req.body.key_bundle.registrationId; 
    User.findOne({"key_bundle": {"registrationId": receiverRegId}}, (err, doc) => {
        if (err) res.status(400).send("User not found.");
        else if (doc) { // return receiver's key bundle 
            console.log("Receiver's key bundle is: ", doc); 
            res.status(200).send(doc);
            //next();
            return;
        }
    });

}

const startSession = (req, res, next) => {


//send short term one-time keys for messages
//chain message



}




module.exports = { saveIdentity, findIdentity };




