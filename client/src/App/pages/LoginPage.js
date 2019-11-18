import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';

class LoginPage extends Component {
    onGoogleLoginSuccess(response) {
        // Make sure response is valid & contains token.
        if (response == null || response.Zi == null
            || response.Zi.id_token == null) {
            return;
        }

        console.log(response);
        console.log(response.Zi.id_token);
        // TODO Send the login token to the backend to verify.
        fetch('/api/authentication/validateGoogleUser', {
            method:     'POST',
            headers:    {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
            },
            body:       JSON.stringify({
                id_token:   response.Zi.id_token
            })
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
                    onSuccess={this.onGoogleLoginSuccess}
                    onFailure={this.onGoogleLoginFailure}
                    cookiePolicy={'single_host_origin'} />
            </div>
        );
    }
}

export default LoginPage;
