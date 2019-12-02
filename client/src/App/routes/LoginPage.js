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

        this.useTester = false;
        this.testerAcc = "";
        this.handleTesterLogin = null;

        if (this.props != null) {
            // Check if use tester
            if (this.props.useTester != null) {
                var testerRequestURI = '/api/authentication/validateTester' +
                    this.props.useTester;
                this.handleTesterLogin = (function() {
                    this.sendLoginRequest(testerRequestURI, {});
                }).bind(this);
                this.useTester = true;
                this.testerAcc = this.props.useTester;
                console.log("Using tester login uri: " + testerRequestURI);
            }

            if (this.props.location != null && this.props.location.state != null
                && this.props.location.state.from != null
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
    }

    /*componentDidMount() {
        // Dynamically remove the navigation bar container and resize
        // the page container to span the entire page.
        var rowItem = this.refs.loginPageContainer.parentElement;
        var row = rowItem.parentElement;
        if (row.childNodes.length == 2) {
            for (var i = 0; i < row.childNodes.length; i++) {
                if (row.childNodes[i] == rowItem) {
                    continue;
                }
                row.removeChild(row.childNodes[i]);
                break;
            }
            rowItem.className = 'col-md-12';
        }
    }*/

    sendLoginRequest(requestURI, token) {
        // Send the login token to the backend to get session token.
        var headers = {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
        };
        pfetch.jsonPost(requestURI, token,
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

    onGoogleLoginSuccess(response) {
        // Make sure response is valid & contains token.
        if (response == null || response.Zi == null
            || response.Zi.id_token == null) {
            return;
        }

        this.sendLoginRequest('/api/authentication/validateGoogleUser',
            {id_token: response.Zi.id_token});
    }

    onGoogleLoginFailure(response) {
        console.log("GOOGLE FAILURE:");
        console.log(response);
    }
    render() {
        return(
        <div ref='loginPageContainer' className='login-page text-center'>
            <div className="row">
                <div className="col-12">
                    <div className="login-logo"> 
                        <img src= {logo} />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="login-msg col-12">
                    <p>To get started, sign in with your ucsd account.</p>
                </div>
            </div>

            <div className="row">
                <div className="col-12"> 
                    {this.useTester == true &&
                        <button type='button' onClick={this.handleTesterLogin}>
                            {"Sign in with Tester " + this.testerAcc}
                        </button>
                    }
                    {this.useTester == false &&
                    <GoogleLogin
                        className="login-button"
                        clientId="367161453960-u7qnu0melhkcq45t3va5d1vik0fu0a5s.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        theme='dark'
                        onSuccess={this.onGoogleLoginSuccess.bind(this)}
                        onFailure={this.onGoogleLoginFailure}
                        cookiePolicy={'single_host_origin'} />
                    }
                </div>
            </div>
        </div>
        );
    }
}

export default LoginPage;
