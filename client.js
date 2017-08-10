KeyHelper = libsignal.KeyHelper;

const store = new SignalProtocolStore();

// -- const registrationId = KeyHelper.generateRegistrationId();
// Store registrationId somehwere durable and safe.
// -- console.log('My registrationId is: ', registrationId);

// let longTermKeyPair = {};  --> not needed 

//--const keyID = 1337; // Our made up key ID 

// const registerID = () => {}; 
 const keyBundle = {}; 


function generateIdentity(store) {
    return Promise.all([
        KeyHelper.generateRegistrationId(),
        KeyHelper.generateIdentityKeyPair()
    ]).then((result) => {
        // result[0] --> registration ID 
        console.log("Reg id: ", result[0]); 
        console.log("Ident key: ", result[1]); 
        // result[1] --> identity key pair 
        store.put('registrationId', result[0]);
        store.put('identityKey', result[1]);
    });
}

function generateKeysBundle(store) {
    // check our store for Identity Key Pair and registration ID
    // return them  as promises 

    const keyID = 1337; // Our made up key ID 

    return Promise.all([
        store.getLocalRegistrationId(),
        store.getIdentityKeyPair()
    ]).then((result) => {
        // store Identity Key Pair and Registration ID in temp variables
        var regId = result[0];
        var identKeyPair = result[1];
        console.log("identKeyPair is: ", identKeyPair); 

        // generatePreKey and signedPreKeys 
        return Promise.all([
            KeyHelper.generatePreKey(keyID), // fix  
            KeyHelper.generateSignedPreKey(identKeyPair, keyID) // identKey, keyId
        ]).then((keys) => {
            const preKey = keys[0]; 
            console.log("our PreKeyPair is: ", preKey); 
            const signedPreKey = keys[1]; 
            console.log("our signedPreKeyPair is: ", PreKey); 

            // Store keys 
            store.storePreKey(keyID, preKey.keyPair); 
            store.storeSignedPreKey(keyID, signedPreKey.keyPair); 

            // Bundle all the keys 
            return {
                identityKey: identKeyPair.pubKey, 
                registrationId: regId, 
                preKey: {
                    keyId: keyID, 
                    publicKey: preKey.keyPair.pubKey, 
                }, 
                signedPreKey: {
                    keyId: keyID,
                    publicKey: signedPreKey.keyPair.pubKey, 
                    signature: signedPreKey.signature
                }
            }; 

        });
    });
}

generateIdentity(store);
generateKeysBundle(store); 



//const randomObject = generateKeysBundle(store); 
//console.log(generateKeyBundle(store));

// KeyHelper.generateIdentityKeyPair().then((identityKeyPair) => {
//     // keyPair -> { pubKey: ArrayBuffer, privKey: ArrayBuffer }
//     // Store identityKeyPair somewhere durable and safe.
//     console.log('My identityKeyPair is: ', identityKeyPair);
//     console.log("Pub key ", identityKeyPair.pubKey); 
//     store.put("identityKey", identityKeyPair); 
//     // longTermKeyPair =  identityKeyPair; // store.getIdentityKeyPair(); 

//     KeyHelper.generatePreKey(keyID).then(function(preKey) {
//         store.storePreKey(preKey.keyId, preKey.keyPair);
//         console.log("Our prekeys are: ", preKey);

//         KeyHelper.generateSignedPreKey(identityKeyPair, keyID).then(function(signedPreKey) {
//             store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);
//             console.log("Our signedPreKey ", signedPreKey); 

            
//             // RIGHT HERE 
//             // Retrieve: 1) identityKeyPair 2) preKeyPair 3) signedPreKeyPair  TO SEND to server 
//             // 1: store.getIdentityKeyPair(); 
//             store.getIdentityKeyPair().then( identKeyPair => {
//                 console.log("For server - longTermKeys: ", identKeyPair);
//                 keyBundle.identityKeyPair = identKeyPair;   
//             });

//             // 2: store.loadPreKey(keyID); 
//             store.loadPreKey(keyID).then( ourPreKey => {
//                 console.log("For server - PreKey: ", ourPreKey); 
//                 keyBundle.preKey = ourPreKey; 
//             });
            

//             // 3: store.loadSignedPreKey(keyID); 
//             store.loadSignedPreKey(keyID).then( ourSignedPreKeys => {
//                 console.log("For server - signedPreKey: ", ourSignedPreKeys); 
//                 keyBundle.signedPreKey = ourSignedPreKeys; 
//             }); 
//         });
//     }); 
// });

// console.log("Our Key bundle is: ", keyBundle); 
// ---------------------------------------------------------
// // SESSION 
// var address = new libsignal.SignalProtocolAddress(recipientId, deviceId); 

// // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
// SessionBuilder = new libsignal.SessionBuilder(store, address);

// // Process a prekey fetched from the server. Returns a promise that resolves
// // once a session is created and saved in the store, or rejects if the
// // identityKey differs from a previously seen identity for this address.
// var promise = sessionBuilder.processPreKey({
//     registrationId: Number,
//     identityKey: ArrayBuffer,
//     signedPreKey: {
//         keyId     : Number,
//         publicKey : ArrayBuffer,
//         signature : ArrayBuffer
//     },
//     preKey: {
//         keyId     : Number,
//         publicKey : ArrayBuffer
//     }
// });

// promise.then(function onsuccess() {
//   // encrypt messages
// });

// promise.catch(function onerror(error) {
//   // handle identity key conflict
// });