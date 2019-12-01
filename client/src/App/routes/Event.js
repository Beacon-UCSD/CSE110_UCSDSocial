import React, {Component} from "react";
import pfetch from '../fetch.protected';
import { Link } from 'react-router-dom';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: {}
        }
        this.handleUpdateEvent = this.handleUpdateEvent.bind(this);
    }

    componentDidMount = () => {
        pfetch.jsonGet('/api/getEvent?EventID=' + this.props.match.params.EventID,
            (data) => {
                //data.tagID = data.tagID.join(', ');
                data.Startdate = new Date(data.Startdate).getTime();
                data.Enddate = new Date(data.Enddate).getTime();
                this.setState({ event: data });
            });
    }

    handleUpdateEvent(){
        // pass in json to updateevent
        let evt = {
            Eventname: this.state.event.Eventname,
            Description: this.state.event.Description,
            Startdate: this.state.event.Startdate,
            Enddate: this.state.event.Enddate,
            Private: this.state.event.Private,
        }
        console.log(evt);
        this.props.history.push({
            pathname: '/app/UpdateEvent',
            state:{evt: evt}
        })
    }

    render() {
        return (
            <div>
            <div id="mySidenav" class="sidenav">
              <a href="/app/Profile">Profile</a>
              <a href="/app/Eventfeed">Events</a>
              <a href="/app/CreateEvent">Create Event</a>
              <a href="/app/Profile">Logout</a>
            </div>
              <div id="main">

                  <h1>Event Name: {this.state.event.Eventname}</h1>
                  <h2>
                      Start date: {(new Date(this.state.event.Startdate)).toLocaleString()}
                      <br/>
                      End date: {(new Date(this.state.event.Enddate)).toLocaleString()}
                      <br/>
                  </h2>
                  <h3>Tags: {this.state.event.Tags}</h3>
                  <h3>Host: {this.state.event.Host}</h3>
                  <h3>This is a {this.state.event.Private === true ? "Private": "Public"} event</h3>
                  <p>{this.state.event.Description}</p>
                  <h4>Attendees: {this.state.event.Attendees}</h4>
                  <button onClick={this.handleUpdateEvent}>Update Event</button>
              </div>
            </div>
        );
    }
}
export default Event;
