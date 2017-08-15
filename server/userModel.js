const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mLabURI = 'mongodb://admindb_test1:56@z!opTest@ds155841.mlab.com:55841/signal_testdb'; 

const URI = process.env.MONGO_URI || mLabURI; 

mongoose.connect(URI); 
mongoose.connection.once('open', () => {
    console.log('Connected to database!'); 
}); 

const userSchema = new Schema({
    key_bundle: {
        registrationId: {
            type: Number
        },
        identityKey: {
            type: ArrayBuffer
        },
        signedPreKey: {
            keyId: {
                type: Number
            },
            publicKey: {
                type: ArrayBuffer
            },
            signature: {
                type: ArrayBuffer
            }
        },
        preKey: {
            keyId: {
                type: Number
            },
            publicKey: {
                type: ArrayBuffer
            }
        }
    }, 
    last_time_connected: { 
        last_time: {
            type: Date
        },
        last_message: {
            type: ArrayBuffer
        } 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;