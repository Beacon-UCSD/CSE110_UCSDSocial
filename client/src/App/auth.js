/*
 * Project:         UCSD Social
 * --------------------------------------------------------------
 * File:            auth.js
 * Date Created:    11/15/2019
 * Description:     Tracks user authentication status.
 */
const jwt = require('jsonwebtoken');

var getUserInfo = function(sessionToken) {
    var decodedToken = jwt.decode(sessionToken);
    var userInfo = {
        name:       decodedToken.name,
        email:      decodedToken.email,
        pictureSrc: decodedToken.picture
    };
    return userInfo;
};

class Auth {
    constructor() {
        this.authenticated = false;
        this.sessionToken = null;
        this.userInfo = null;

        // Retrieve session if available.
        if (typeof(Storage) !== 'undefined') {
            this.sessionToken = localStorage.getItem('session', this.sessionToken);
            if (this.sessionToken != null) {
                this.authenticated = true;
                this.userInfo = getUserInfo(this.sessionToken);
            }
        }
    }

    login(sessionToken, callback) {
        this.authenticated = true;
        this.sessionToken = sessionToken;
        this.userInfo = getUserInfo(this.sessionToken);

        // Store session if storage available.
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('session', sessionToken);
        }

        if (callback != null) {
            callback();
        }
    }

    logout(callback) {
        this.authenticated = false;
        this.sessionToken = null;
        this.userInfo = null;

        // Delete session in storage.
        if (typeof(Storage) !== 'undefined') {
            localStorage.removeItem('session');
        }

        if (callback != null) {
            callback();
        }
    }

    isAuthenticated() {
        return this.authenticated;
    }

    getSessionToken() {
        if (this.isAuthenticated()) {
            return this.sessionToken;
        } else {
            return null;
        }
    }

    getUserInfo() {
        if (this.isAuthenticated()) {
            return this.userInfo;
        } else {
            return null;
        }
    }
}

// Singleton, export instance of class.
export default new Auth();

