/*
 * File:            fetch.protected.js
 * Description:     Send get/post requests. If session token available, adds
 *                  Authorization header.
 */
import auth from './auth';

class ProtectedFetch {
    /*
     * Send HTTP request to server.
     *
     * param string path:       The API path.
     * param string method:     Type of request (POST/GET).
     * param string body:       The data to send with the HTTP request.
     * param object callback:   Function called with arguments (jsonData). Nullable.
     * param object headers:    Any additional headers to set. Nullable.
     */
    jsonRequest(path, method, body, callback, headers) {
        // If no headers provided, set to empty object.
        if (headers == null) {
            headers = {};
        }

        // Update header.
        headers['Content-Type'] = 'application/json';
        if (typeof body == 'object') {
            headers['Accept'] = 'application/json';
            body = JSON.stringify(body);
        }
        // Add authoriztion header
        var sessionToken = auth.getSessionToken();
        if (sessionToken != null) {
            headers['Authorization'] = 'Bearer ' + auth.getSessionToken();
        }

        var req;
        if (method === 'GET' || method === 'HEAD' || body == null) {
            // Make request with no body.
            req = fetch(path, {
                method:     method,
                headers:    headers
            });
        } else {
            // Make request with no body.
            req = fetch(path, {
                method:     method,
                headers:    headers,
                body:       body
            });
        }

        // Append response listener to invoke callback
        req.then((response) => {
            if (response.status === 401) { 
                // Unauthorized, maybe token expired?
                auth.logout();
            }
            return response.json();
        }).then((data) => {
            if (callback != null) {
                callback(data);
            }
        });
    }

    /*
     * Send GET request to server. See jsonRequest for parameter info.
     */
    jsonGet(path, callback, headers=null) {
        this.jsonRequest(path, 'GET', null, callback, headers);
    }

    /*
     * Send POST request to server. See jsonRequest for parameter info.
     */
    jsonPost(path, body, callback, headers=null) {
        this.jsonRequest(path, 'POST', body, callback, headers);
    }
}

// Singleton, export instance of class.
export default new ProtectedFetch();
