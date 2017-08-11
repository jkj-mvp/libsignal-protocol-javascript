

// function generateIdentity(store) {
    
//     return Promise.all([
//         KeyHelper.generateRegistrationId(),
//         KeyHelper.generateIdentityKeyPair()
//     ]).then((result) => {
//         // result[0] --> registration ID 
//         console.log("Reg id: ", result[0]); 
//         console.log("Ident key: ", result[1]); 
//         // result[1] --> identity key pair 
//         store.put('registrationId', result[0]);
//         store.put('identityKey', result[1]);
//     });
// }

const generateIdentity = async (store) => {
    // Generate Registration ID 
    const regId = await KeyHelper.generateRegistrationId(); 

    // Generate Identity Key Pair 
    const identKeyPair = await KeyHelper.generateIdentityKeyPair(); 

    // Store Registration ID and Key Pair in the store
    store.put('registrationId', regId);
    store.put('identityKey', identKeyPair);
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
        const regId = result[0];
        const identKeyPair = result[1];

        // generatePreKey and signedPreKeys 
        return Promise.all([
            KeyHelper.generatePreKey(keyID), // fix  
            KeyHelper.generateSignedPreKey(identKeyPair, keyID) // identKey, keyId
        ]).then((keys) => {
            const preKey = keys[0]; 
            console.log("our PreKeyPair is: ", preKey); 
            const signedPreKey = keys[1]; 
            console.log("our signedPreKeyPair is: ", signedPreKey); 

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

// function startSession() {

// }

// function sendMessage() {
//     // encrypt message 

// }


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



