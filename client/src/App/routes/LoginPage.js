import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import auth from '../auth';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        // If user is already logged in and goes to login page, redirect to
        // home page.
        if (auth.isAuthenticated()) {
            this.props.history.push('/app');
        }
    }

    onGoogleLoginSuccess(response) {
        // Make sure response is valid & contains token.
        if (response == null || response.Zi == null
            || response.Zi.id_token == null) {
            return;
        }

        //console.log(response);
        // Send the login token to the backend to get session token.
        fetch('/api/authentication/validateGoogleUser', {
            method:     'POST',
            headers:    {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
            },
            body:       JSON.stringify({
                id_token:   response.Zi.id_token
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (!("sessionToken" in data)) {
                console.log("Error. Backend didn't send session token.");
                console.log("Backend response:", data);
                return;
            }

            // Login user and redirect to main page
            auth.login(data.sessionToken, () => {
                // Redirect user to app
                if (this.state != null && "from" in this.state
                    && this.state.from.toLowerCase().startsWith('/app')) {
                    // User was sent here when they tried to visit a protected
                    // route.
                    // Send user back to where they came from now that they've
                    // logged in.
                    this.props.history.push(this.state.from);
                } else {
                    this.props.history.push('/app');
                }
            });
        });
    }

    onGoogleLoginFailure(response) {
        console.log("GOOGLE FAILURE:");
        console.log(response);
    }

    render() {
        return(
            <div>
                <p>{"To get started, sign in with your ucsd account."}</p>
                <GoogleLogin
                    clientId="367161453960-u7qnu0melhkcq45t3va5d1vik0fu0a5s.apps.googleusercontent.com"
                    buttonText="Sign in with Google"
                    theme='dark'
                    onSuccess={this.onGoogleLoginSuccess.bind(this)}
                    onFailure={this.onGoogleLoginFailure}
                    cookiePolicy={'single_host_origin'} />
            </div>
        );
    }
}

export default LoginPage;
