import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pfetch from '../fetch.protected';

import './EventFeed.css';

class EventFeed extends Component {

    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the event feed on mount
    componentDidMount() {
        /*
        fetch('/api/getList')
        .then(res => res.json())
        .then(list => this.setState({ list }))*/
        pfetch.jsonGet('/api/getList', (list) => {
            this.setState({ list });
        });
    }

    render(){
        const { list } = this.state;
        return(
            <div>
                <h1> Event Feed </h1>
                <div id="mySidenav" class="sidenav">
                  <a href="/app/Profile">Profile</a>
                  <a href="/app/Eventfeed">Events</a>
                  <a href="/app/CreateEvent">Create Event</a>
                  <a href="/app/Profile">Logout</a>
                </div>
                <div id="main">

                    {list.map((item) => {
                        return(
                            <div key={item.EventID}>
                                <Link to={'/app/Event/' + item.EventID}>
                                    <button className="eventButton">
                                        <h2>{item.Eventname}</h2>
                                        <h3>Start: {item.Startdate}</h3>
                                        <h3>End: {item.Enddate}</h3>
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div>
                </div>
            </div>
        );
    }

}

export default EventFeed;
