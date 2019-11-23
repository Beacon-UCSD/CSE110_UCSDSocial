import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import EventFeed from "./routes/EventFeed";
import Event from "./routes/Event";
import Profile from "./routes/Profile";

import { Switch } from 'react-router-dom';
import './App.css';
import CreateEvent from './routes/CreateEvent';
import UpdateEvent from './routes/UpdateEvent';

class App extends Component {

  render() {

    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={EventFeed}/>
          <Route exact path='/EventFeed' component={EventFeed}/>
          <Route exact path='/CreateEvent' component={CreateEvent}/>
          <Route exact path='/UpdateEvent' component={UpdateEvent}/>
          <Route exact path='/Profile' component={Profile}/>
          <Route path='/Event/:EventID' component={Event}/>
        </Switch>
      </div>
    )

    return (
      <Router>
        <App/>
      </Router>
    );
  }

}

export default App;
