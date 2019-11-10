import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import EventFeed from "./routes/EventFeed";

import { Switch } from 'react-router-dom';
import './App.css';
import CreateEvent from './routes/CreateEvent';

class App extends Component {

  render() {

    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={EventFeed}/>
          <Route exact path='/EventFeed' component={EventFeed}/>
          <Route exact path='/CreateEvent' component={CreateEvent}/>
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
