import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { ProtectedRoute } from './protected.route.js';

import './App.css';

import NavBar      from './components/NavBar';

import LoginPage   from './routes/LoginPage';
import Profile     from './routes/Profile';
import EventFeed   from './routes/EventFeed';
import Event       from './routes/Event';
import CreateEvent from './routes/CreateEvent';
import UpdateEvent from './routes/UpdateEvent';
import UpdateProfile from './routes/UpdateProfile';

class App extends Component {
    componentDidMount() {
        // Set title shown in browser.
        document.title = "UCSD Social";
    }

    render() {
        return (
            <div className="app container-fluid">
                <div className="row">
                    <Router>
                        <div className="col-md-1">
                            <ProtectedRoute path='/app' component={NavBar} />
                        </div>
                        <div className="col-md-11">
                            <Switch>
                                <Route exact path='/(|login)' component={LoginPage} />
                                <Route exact path='/loginTester1'
                                    render={(routeProps) => (<LoginPage {...routeProps} useTester={"1"} />)} />
                                <Route exact path='/loginTester2'
                                    render={(routeProps) => (<LoginPage {...routeProps} useTester={"2"} />)} />
                                <ProtectedRoute exact path='/app(|/EventFeed)' component={EventFeed} />
                                <ProtectedRoute exact path='/app/CreateEvent' component={CreateEvent} />
                                <ProtectedRoute exact path='/app/UpdateEvent' component={UpdateEvent} />
                                <ProtectedRoute exact path='/app/Event/:EventID' component={Event} />
                                <ProtectedRoute exact path='/app/Profile' component={Profile}/>
                                <ProtectedRoute exact path='/app/UpdateProfile' component={UpdateProfile} />
                            </Switch>
                        </div>
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;
