import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import Cookies from 'js-cookie';

class LoginPage extends Component {

    onGoogleLoginSuccess(response) {

        // Make sure response is valid & contains token.
        if (response == null || response.Zi == null
            || response.Zi.id_token == null) {
            return;
        }

        //store the user email in a cookie
        //note that we should encrypt this email cookie when getting serious
        //so that user can't modify the cookie and hack another user
        
        var inFifteenMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
        Cookies.set('user_email', response.w3.getEmail(), 
                                     {expires: inFifteenMinutes});
        
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
