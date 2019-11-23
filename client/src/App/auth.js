/*
 * Project:         UCSD Social
 * --------------------------------------------------------------
 * File:            auth.js
 * Date Created:    11/15/2019
 * Description:     Tracks user authentication status.
 */

class Auth {
    constructor() {
        this.authenticated = false
    }

    login(callback) {
        this.authenticated = true;
        // TODO authenticate user
        callback();
    }

    logout(callback) {
        this.authenticated = false;
        callback();
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

// Singleton, export instance of class.
export default new Auth();

