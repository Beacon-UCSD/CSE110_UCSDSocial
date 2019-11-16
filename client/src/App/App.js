import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import LoginPage from './pages/LoginPage';

class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: 'NOT_LOGGED_IN',
            user: {}
        };
    }

    componentDidMount() {
        // Set title shown in browser.
        document.title = "UCSD Social";
    }

    render() {
        return (
            <div className="app">
                <Router>
                    <Switch>
                        <Route exact path='/' component={LoginPage} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
