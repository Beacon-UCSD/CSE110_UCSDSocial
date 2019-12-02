import React, {Component} from "react";
import pfetch from '../fetch.protected';
import auth from '../auth';

import { Link } from 'react-router-dom';

class Event extends Component {

    constructor(props) {
        super(props);
        this.userInfo = auth.getUserInfo();

        this.state = {
            event: null
        };

        this.handleJoinEvent   = this.handleJoinEvent.bind(this);
        this.handleLeaveEvent   = this.handleLeaveEvent.bind(this);
        this.handleUpdateEvent = this.handleUpdateEvent.bind(this);
        this.hasJoinedEvent    = this.hasJoinedEvent.bind(this);
        this.updateEventData   = this.updateEventData.bind(this);
    }

    componentDidMount() {
        this.updateEventData();
    }

    updateEventData() {
        pfetch.jsonGet('/api/getEvent?EventID='+this.props.match.params.EventID,
            (data) => {
                //data.tagID = data.tagID.join(', ');
                data.Startdate = new Date(data.Startdate).getTime();
                data.Enddate = new Date(data.Enddate).getTime();
                data.Tags = data.Tags.replace(/[\[\]"]+/gi, "").replace(/[,]+/gi, ", ");

                // TEMP: test
                if (data.Attendees === "") {
                    data.Attendees = [];
                } else {
                    data.Attendees = JSON.parse(data.Attendees);
                }

                this.setState({ event: data, flag: false });
                console.log(this.state.event);
            });
    }

    handleJoinEvent() {
        pfetch.jsonPost('/api/joinEvent',
            {EventID: this.props.match.params.EventID}, (function(json) {
                this.updateEventData();
            }).bind(this));
    }

    handleLeaveEvent() {
        pfetch.jsonPost('/api/leaveEvent',
            {EventID: this.props.match.params.EventID}, (function(json) {
                this.updateEventData();
            }).bind(this));
    }

    handleUpdateEvent(){
        // pass in json to updateevent
        let evt = {
            Eventname: this.state.event.Eventname,
            Description: this.state.event.Description,
            Startdate: this.state.event.Startdate,
            Enddate: this.state.event.Enddate,
            Private: this.state.event.Private,
            Tags: this.state.event.Tags,
        }
        console.log(evt);
        this.props.history.push({
            pathname: '/app/UpdateEvent',
            state:{evt: evt}
        })
    }

    hasJoinedEvent() {
        if (this.state.event == null) {
            return null;
        }

        for (var i = 0; i < this.state.event.Attendees.length; i++) {
            if (this.state.event.Attendees[i].userID == this.userInfo.id) {
                return true;
            }
        }

        return false;
    }

    render() {
        if (this.state.event == null) {
            return <div></div>;
        }

        // Show update event button when you own this event
        let showUpdate;
        if (this.state.event.Hostemail == this.userInfo.email) {
            showUpdate = <button onClick={this.handleUpdateEvent}>Update Event
                </button>;
        } else {
            showUpdate = null;
        }


        // Show join or leave event button based on your attendance
        var joinedEvent = this.hasJoinedEvent();
        let showAttendance;
        if (joinedEvent === false) {
            showAttendance = <button onClick={this.handleJoinEvent}>Join Event
                </button>;
        } else if(joinedEvent === true) {
            showAttendance = <button onClick={this.handleLeaveEvent}>Leave Event
                </button>;
        } else {
            showAttendance = null;
        }
        /*
        let showUpdate = this.userInfo.email == this.state.event.Hostemail ?
            <button onClick={this.handleUpdateEvent}>Update Event</button> : null;
        let showAttendance = this.joinEventStatus() === false ?
            <button onClick={this.handleJoinEvent}>Join Event</button> : null;*/

        return (
            <div>
              <div id="main">

                  <img src={this.state.event.FlyerURL} height="150" width="150"/>
                  <h2>Event Name: {this.state.event.Eventname}</h2>
                  <h4>Description:</h4>
                  <p>{this.state.event.Description}</p>
                  
                  <h4>Start date:</h4>
                  <p>{(new Date(this.state.event.Startdate)).toLocaleString()}</p>
                  <h4>End date:</h4>
                  <p>{(new Date(this.state.event.Enddate)).toLocaleString()}</p>
                  
                  <h4>Tags: {this.state.event.Tags}</h4>

                  <h4>Attendees:</h4>
                  {this.state.event.Attendees.map((attendee, i) => (
                      <div key={i}><Link to={'/app/Profile/'+attendee.userID}>
                        {attendee.userName}</Link></div>
                  ))}

                  <h4>Host: {this.state.event.Hostname}</h4>
                  <p>This is a {this.state.event.Private === 1 ? "Private": "Public"} event</p>
                  {showUpdate}
                  {showAttendance}
              </div>
            </div>
        );
    }
}
export default Event;
