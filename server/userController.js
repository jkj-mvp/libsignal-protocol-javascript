const mongoose = require('mongoose'); 

const User = require('./userModel'); 


// Save Identity and Key Bundle in Database 
const saveIdentity = (req, res, next) => {

    console.log("Our body is: ", req.body); 
    let keyBundle = req.body.keyBundle; 
    console.log("Our key bundle is ", keyBundle); 

    const senderRegId = req.body.keyBundle.registrationId; 
    console.log("Our Sender Reg ID is: ", senderRegId); 
    

    // If user already exists in database, replace key bundle 
    User.findOne({key_bundle: {registrationId: senderRegId}}, async (err, doc) => {
        if (err) res.status(400).send("User not found.")
        else if (doc) {
            res.status(200).send('User already exists.'); 
            next(); 
            return; 
        } else {
            await User.create({}, (err,doc) => {
                if (err) res.status(500).send("Could not register. Try again."); 
                else res.status(200).send("Success!")
            }); 
        }
    })

    // If the user is not in the databse, create new user & save

    // done 
}

// Serve the Receiver's Key Bundle to Sender if found




module.exports = { saveIdentity }; 




