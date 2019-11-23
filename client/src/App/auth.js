/*
 * Project:         UCSD Social
 * --------------------------------------------------------------
 * File:            auth.js
 * Date Created:    11/15/2019
 * Description:     Tracks user authentication status.
 */

class Auth {
    constructor() {
        this.authenticated = false;
        this.sessionToken = null;

        // Retrieve session if available.
        if (typeof(Storage) !== 'undefined') {
            this.sessionToken = localStorage.getItem('session', this.sessionToken);
            if (this.sessionToken != null) {
                this.authenticated = true;
            }
        }
    }

    login(sessionToken, callback) {
        this.authenticated = true;
        this.sessionToken = sessionToken;

        // Store session if storage available.
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('session', sessionToken);
        }

        callback();
    }

    logout(callback) {
        this.authenticated = false;
        this.sessionToken = null;

        // Delete session in storage.
        if (typeof(Storage) !== 'undefined') {
            localStorage.removeItem('session');
        }

        callback();
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
}

// Singleton, export instance of class.
export default new Auth();

