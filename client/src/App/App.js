import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { ProtectedRoute } from './protected.route.js';

import LoginPage   from './routes/LoginPage';
import EventFeed   from './routes/EventFeed';
import Event       from './routes/Event';
import CreateEvent from './routes/CreateEvent';
import UpdateEvent from './routes/UpdateEvent';


class App extends Component {
    constructor() {
        super();
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
                        <Route exact path='/(|login)' component={LoginPage} />
                        <ProtectedRoute exact path='/app(|/EventFeed)' component={EventFeed} />
                        <ProtectedRoute exact path='/app/CreateEvent' component={CreateEvent} />
                        <ProtectedRoute exact path='/app/UpdateEvent' component={UpdateEvent} />
                        <ProtectedRoute exact path='/app/Event/:EventID' component={Event} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
