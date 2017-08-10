

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

function startSession() {

}

function sendMessage() {
    // encrypt message 

}






registerID().then(
    generateKeys().then(
        startSession().then(
            sendMessage(); 
        );
    );
);

