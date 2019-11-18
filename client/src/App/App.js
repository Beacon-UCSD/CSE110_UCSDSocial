import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import LoginPage   from './pages/LoginPage';
import EventFeed   from './routes/EventFeed';
import CreateEvent from './routes/CreateEvent';
import Event       from './routes/Event';

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
                        <Route exact path='/EventFeed' component={EventFeed} />
                        <Route exact path='/CreateEvent' component={CreateEvent} />
                        <Route exact path='/Event/:EventID' component={Event} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
