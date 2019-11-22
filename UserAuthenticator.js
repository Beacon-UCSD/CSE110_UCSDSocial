const request = require('request');
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'XMUpGzUWhsWBaVN2Wszp'; // SECRET, do not expose to client

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

            generateSessionToken(token, function(err, token) {
                if (err) {
                    console.log("Error generating session token.");
                    console.log(err);
                    clientRes.status(500).json({success:false});
                    return;
                }
                console.log(token);
                clientRes.status(200).json({success:true});
            });
        }
    );

    //clientRes.status(200).json({success:true}); // temporary, just to stop browser from waiting for response forever
    // TODO Check if the token user sent is valid and unmodified.
    // We can either use a npm package for this such as express-jwt, which appears
    // to also handle authorization to allow/reject users from accessing certain apis.
    //
    // Or we can send a GET request to https://oauth2.googleapis.com/tokeninfo?id_token=TOKEN_HERE
    // But with this method if google's api ever goes down then we are screwed.
};


// This function responds with a session token based on a token from Google sign-in.
// The callback parameters are (err, token)
//
// param object token: The validated and parsed token from Google sign-in.
var generateSessionToken = function(token, callback) {
    // Our session token swaps the Google user id with our own id.
    // To do this we have to first get the user's id from the database.
    
    // Create a session token..
    jwt.sign({
        exp:        parseInt(token.exp),
        sub:        -1, // TODO get user id from google_id from db
        name:       token.name,
        email:      token.email,
        picture:    token.picture
    }, JWT_SIGN_SECRET, {algorithm:'HS256'}, callback);
};
