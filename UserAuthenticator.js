const request = require('request');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// SECRETS. DO NOT expose to client.
const JWT_SIGN_SECRET = 'XBqv88W69RQS9a9f9WD6fbtZ';
const TOKEN_KEY = Buffer.from('a6a1998373635907b329a54c1e11840a', 'hex');

// Authenticates a user with a token from google and respond to user with our 
// own "session token".
//
// param string idToken:    Token received from Google
// param object res:        Response object to respond to user.
exports.authenticate = function(idToken, clientRes) {
    // Validate the token
    // This checks whether the token has expired and whether it is valid and
    // unmodified.
    request("https://oauth2.googleapis.com/tokeninfo?id_token="+idToken,
        function(error, response, token) {
            if (error || token == null) {
                console.log("Error validating token sent by client.");
                console.log(error);
                clientRes.status(500).json({success:false}); // send server error to client.
                return;
            }

            // Parse token and check if is valid.
            token = JSON.parse(token);
            if ("error" in token) {
                clientRes.status(401).json({success:false,message:"Token not valid."});
                return;
            }

            // Extract useful info from validated token
            var tokenType = token.typ;
            var domain = token.hd;
            var expireEpoch = token.exp;
            var googleUserId = token.sub;
            var emailVerified = (token.email_verified == 'true') ? true : false;
            var email = token.email;
            var userName = token.name;
            var userPicture = token.picture;

            // Make sure all info is as expected.
            if (tokenType != 'JWT') {
                clientRes.status(400).json({success:false,message:"Invalid token type sent."});
                return;
            }
            if (domain != 'ucsd.edu' || googleUserId == null || email == null
                || userName == null || expireEpoch == null) {
                clientRes.status(400).json({success:false,message:"Token missing requirements."});
                return;
            }
            if (emailVerified != true) {
                clientRes.status(401).json({success:false,message:"Please verify your email first with Google."});
                return;
            }

            // Check token expiration.
            expireEpoch = parseInt(expireEpoch)*1000;
            if (isNaN(expireEpoch) || expireEpoch < 1572566400000) {
                clientRes.status(400).json({success:false,message:"Token expiration error."});
                return;
            }
            if ((Date.now().valueOf()) > expireEpoch) {
                clientRes.status(401).json({success:false,message:"Token is expired."});
                return;
            }

            // Token has been validated!!!

            generateSessionToken(idToken, token, function(err, token) {
                if (err) {
                    console.log("Error generating session token.");
                    console.log(err);
                    clientRes.status(500).json({success:false});
                    return;
                }
                clientRes.status(200).json({success:true, authToken:token});
            });
        }
    );

};

// Random note
// TODO Use express-jwt for authorization to allow/reject users from accessing certain apis.


// This function responds with a session token based on a token from Google sign-in.
//
// param string idToken:    The encoded token as received from Google.
// param object token:      The validated and parsed token from Google sign-in.
// param object callback:   Function is called with arguments (err, token)
var generateSessionToken = function(idToken, token, callback) {
    // Our session token is short-lived and expires soon.
    // We have to create a refresh token to be used to continue the session.
    // We will use our id token from Google as a refresh token, but this token
    // is not really a refresh token and will expire at some time (~8 hours).
    // If we wanted to get serious we would have a way to continue the session
    // and not abruptly deny the user access after the Google token expires.
    //
    // Inside our session token we will store the Google token encrypted.
    // We issue new session tokens using the Google token as long as the
    // current session token is not expired yet.
    var encryptedIdToken = encryptGoogleToken(idToken);

    // Our session token swaps the Google user id with our own id.
    // TODO To do this we have to first get the user's id from the database.
    
    // Create a session token..
    jwt.sign({
        exp:        parseInt(token.exp),
        sub:        -1, // TODO get user id from google_id from db
        name:       token.name,
        email:      token.email,
        picture:    token.picture,
        ref:        encryptedIdToken
    }, JWT_SIGN_SECRET, {algorithm:'HS256'}, callback);
};

// This function encrypts the google token for storing in a session token.
//
// param string idToken:    The encoded token received from Google sign-in.
// return string:           Returns the encrypted token.
var encryptGoogleToken = function(idToken) {
    var iv = crypto.randomBytes(8).toString('hex');
    var cipher = crypto.createCipheriv('aes-128-cbc', TOKEN_KEY, iv);
    var encryptedIdToken = cipher.update(idToken, 'utf8', 'hex');
    encryptedIdToken += cipher.final('hex');
    encryptedIdToken = iv + encryptedIdToken;
    return encryptedIdToken;
};

// This function decrypts the google token that was encrypted in the
// session token.
//
// param string encrypted:  The encrypted token in string-hex format.
var decryptGoogleToken = function(enc_token, callback) {
    // Decode encrypted token parts.
    var iv = enc_token.slice(0, 16);
    var enc_data = enc_token.slice(16,enc_token.length);

    // Create decipher
    var decipher = crypto.createDecipheriv('aes-128-cbc', TOKEN_KEY, iv);
    var decrypted = "";
    decipher.on('readable', () => {
        while (null !== (chunk = decipher.read())) {
            decrypted += chunk.toString('utf8');
        }
    });
    decipher.on('end', () => {
        callback(decrypted);
    });

    // Decrypt
    try {
        decipher.write(enc_data, 'hex');
        decipher.end();
    } catch(e) {
        console.log("Can't decrypt token.");
        callback(null);
    }
};
