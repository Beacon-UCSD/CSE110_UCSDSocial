import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import auth from '../auth';
import pfetch from '../fetch.protected';
import './LoginPage.css';
import logo from '../assets/images/logo.png';
import background from '../assets/images/background.jpg';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        // If user is already logged in and goes to login page, redirect to
        // home page.
        if (auth.isAuthenticated()) {
            this.props.history.push('/app');
        }

        if (this.props != null && this.props.location != null &&
            this.props.location.state != null && this.props.location.state.from != null
            && this.props.location.state.from.pathname != null &&
            this.props.location.state.from.pathname.toLowerCase().startsWith('/app')) {
            // User was sent here when they tried to visit a protected
            // route.
            // Once the user logs in, send them back to the page they came
            // from.
            this.loginRedirectTo = this.props.location.state.from.pathname;
        } else {
            this.loginRedirectTo = null;
        }
    }

    onGoogleLoginSuccess(response) {
        // Make sure response is valid & contains token.
        if (response == null || response.Zi == null
            || response.Zi.id_token == null) {
            return;
        }

        // Send the login token to the backend to get session token.
        var headers = {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
        };
        pfetch.jsonPost('/api/authentication/validateGoogleUser', {id_token: response.Zi.id_token},
            (data) => {
                // Check if backend sent session token.
                if (!("sessionToken" in data)) {
                    console.log("Error. Backend didn't send session token.");
                    console.log("Backend response:", data);
                    return;
                }

                // Login user and redirect to main page
                auth.login(data.sessionToken, () => {
                    // Redirect user to app
                    if (this.loginRedirectTo != null) {
                        this.props.history.push(this.loginRedirectTo);
                    } else {
                        this.props.history.push('/app');
                    }
                });
            }, headers
        );
    }

    onGoogleLoginFailure(response) {
        console.log("GOOGLE FAILURE:");
        console.log(response);
    }
    render() {
        return(

            <div>

                <p>To get started, sign in with your ucsd account.</p>
                <img src= {background} />
                <div class = "img1"> 
                    <img src= {logo} />
                </div>
                <div class="google"> 
                    <GoogleLogin
                    clientId="367161453960-u7qnu0melhkcq45t3va5d1vik0fu0a5s.apps.googleusercontent.com"
                    buttonText="Sign in with Google"
                    theme='dark'
                    onSuccess={this.onGoogleLoginSuccess.bind(this)}
                    onFailure={this.onGoogleLoginFailure}
                    cookiePolicy={'single_host_origin'} />
                </div>
                
            </div>
        );
    }
}

export default LoginPage;
