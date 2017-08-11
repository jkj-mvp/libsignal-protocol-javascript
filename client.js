KeyHelper = libsignal.KeyHelper;

const store = new SignalProtocolStore();


const generateIdentity = async (store) => {
    // Generate Registration ID 
    const regId = await KeyHelper.generateRegistrationId();

    // Generate Identity Key Pair 
    const identKeyPair = await KeyHelper.generateIdentityKeyPair();

    console.log("Reg id: ", regId);
    console.log("Ident key: ", identKeyPair);

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
        var regId = result[0];
        var identKeyPair = result[1];


        // generatePreKey and signedPreKeys 
        return Promise.all([
            KeyHelper.generatePreKey(keyID), // fix  
            KeyHelper.generateSignedPreKey(identKeyPair, keyID) // identKey, keyId
        ]).then((keys) => {
            const preKey = keys[0];
            console.log("our PreKeyPair is: ", preKey);
            const signedPreKey = keys[1];
            console.log("our signedPreKeyPair is: ", preKey);
            console.log('keys is', keys)

            // Store keys 
            store.storePreKey(keyID, preKey.keyPair);
            store.storeSignedPreKey(keyID, signedPreKey.keyPair);

            // Bundle all the keys 
            console.log("Type of identity key pair ", typeof identKeyPair);
            
            return {
                registrationId: regId,
                identityKey: util.toArrayBuffer(identKeyPair.pubKey), 
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

let keyBundle = {};

generateIdentity(store).then(async () => {
    keyBundle = await generateKeysBundle(store);
    console.log('our key bundle is', keyBundle);
});



// const janelleRecipientId = "sadlfjadsjflas";
// const janelleDeviceId = 5;
// let recipientAddress = '';



var janelle_store = new SignalProtocolStore();
var justino_store = new SignalProtocolStore();


var justino_address = new libsignal.SignalProtocolAddress("YYYYY", 1);
var janelle_address = new libsignal.SignalProtocolAddress("BCBCB", 65);

//janelle_store.address = janelle_address; 

var justinoPreKeyId = 1337;
var justinoSignedKeyId = 1;

    Promise.all([
        generateIdentity(janelle_store),
        generateIdentity(justino_store)
    ]).then(() => {
        return generateKeysBundle(justino_store, justinoPreKeyId, justinoSignedKeyId);
    }).then(function(preKeyBundle) {
        var builder = new libsignal.SessionBuilder(janelle_store, justino_address);
        var builder2 = new libsignal.SessionBuilder(justino_store, janelle_address);

        console.log("Justino's address: ", justino_address);
        console.log("Janelle's address: ", janelle_address);

        //builder.storeSession(); // identifier, record 

        return builder.processPreKey(preKeyBundle).then(() => {
            var originalMessage = util.toArrayBuffer("justino");

            console.log("This is originalMessage: ", originalMessage);
            var janelleSessionCipher = new libsignal.SessionCipher(janelle_store, justino_address);
            var justinoSessionCipher = new libsignal.SessionCipher(justino_store, janelle_address);

            //janelle encryption
            janelleSessionCipher.encrypt(originalMessage).then(function(ciphertext) {
                console.log("Our ciphertext is (inside Janelle encrypt): ", ciphertext);
                return justinoSessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');
            }).then(function(plaintext) {
                alert(util.toString(plaintext));
            });

            //justino encryption
            justinoSessionCipher.encrypt(originalMessage).then(function(ciphertext) {
                return janelleSessionCipher.decryptWhisperMessage(ciphertext.body, 'binary');
            }).then(function(plaintext) {
                assertEqualBuffers(plaintext, originalMessage);
            });
        });
    });


// Start Session 
// const startMySession = async (recipientId, recipientDeviceId, store, recipientKeyBundle) => {
//     recipientAddress = new libsignal.SignalProtocolAddress(recipientId, recipientDeviceId);
//     const sessionBuilder = new libsignal.SessionBuilder(store, recipientAddress);

//     const sessionPromise = await sessionBuilder.processPreKey(recipientKeyBundle);

//     return sessionPromise;

// }

// let plaintext = "Hi Janelle!!";
// const sendMyMessage = (plaintext, store, recipientAddress, sessionPromise) => {
//     //message from cryptpad
//     const sessionCipher = new libsignal.SessionCipher(store, recipientAddress);

//     sessionPromise.then( () => {
//         sessionCipher.encrypt(plaintext).then((ciphertext) => {
//             console.log('Plaintext - managed to pass sessionPromise', plaintext);
//             console.log('Ciphertext - managed to pass sessionPromise', ciphertext);

//             handle(ciphertext.type, ciphertext.body);
//         });
//     });
// }



// startMySession(janelleRecipientId, janelleDeviceId, store, keyBundle).then(() => {
//     sendMyMessage(plaintext, store, recipientAddress, startMySession);
// });


// SESSION 
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
//         keyId: Number,
//         publicKey: ArrayBuffer,
//         signature: ArrayBuffer
//     },
//     preKey: {
//         keyId: Number,
//         publicKey: ArrayBuffer
//     }
// });

// promise.then(function onsuccess() {
//     // encrypt messages

// });

// promise.catch(function onerror(error) {
//     // handle identity key conflict
// });