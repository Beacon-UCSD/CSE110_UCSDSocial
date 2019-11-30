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
        /*fetch('/api/getEvent?EventID=' + this.props.match.params.EventID).then(res => res.json()).then(e => {
            this.setState({
                event: e
            })
        })*/
        pfetch.jsonGet('/api/getEvent?EventID=' + this.props.match.params.EventID,
            (data) => {
                //data.tagID = data.tagID.join(', ');
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
                <Link to={'/app/Profile'}>
                  <a href="#">Profile</a>
                </Link>
                <Link to={'/app/Eventfeed'}>
                  <a href="#">Events</a>
                </Link>
                <Link to={'/app/CreateEvent'}>
                  <a href="#">Create Event</a>
                </Link>
                <a href="#">Logout</a>
              </div>
              <div id="main">

                  <h1>Event Name: {this.state.event.Eventname}</h1>
                  <h2>
                      Start date: {this.state.event.Startdate}
                      <br/>
                      End date: {this.state.event.Enddate}
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
