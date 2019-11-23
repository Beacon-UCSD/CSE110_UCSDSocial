import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import auth from '../auth';

class LoginPage extends Component {
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
            console.log("Backend response: ", data);
            // Login user and redirect to main page
            auth.login(() => {
                this.props.history.push('/app');
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
