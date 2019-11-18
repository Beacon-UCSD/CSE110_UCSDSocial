// Authenticates a user and respons to user with session id.
// param string idToken:    Token received from Google
// param object res:        Response object to respond to user.
exports.authenticate = function(idToken, res) {
    res.status(200).json({success:true}); // temporary, just to stop browser from waiting for response forever
    // TODO Check if the token user sent is valid and unmodified.
    // We can either use a npm package for this such as express-jwt, which appears
    // to also handle authorization to allow/reject users from accessing certain apis.
    //
    // Or we can send a GET request to https://oauth2.googleapis.com/tokeninfo?id_token=TOKEN_HERE
    // But with this method if google's api ever goes down then we are screwed.
};
