import React, {Component} from "react";
import pfetch from '../fetch.protected';
import auth from '../auth';

import { Link } from 'react-router-dom';

class Event extends Component {

    constructor(props) {
        super(props);
        this.userInfo = auth.getUserInfo();
        console.log(this.userInfo);

        this.state = {
            event: {},
            flag: true
        };
        console.log(this.state.event);
        this.handleUpdateEvent = this.handleUpdateEvent.bind(this);
        this.handleJoinEvent = this.handleJoinEvent.bind(this);
        this.joinEventStatus = this.joinEventStatus.bind(this);
        console.log(this.state.event);
    }

    componentDidMount = () => {
        pfetch.jsonGet('/api/getEvent?EventID=' + this.props.match.params.EventID,
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
        var attendees = {
            userID: this.userInfo.id,
            userName: this.userInfo.name
        }

        console.log(this.state.event.Attendees);
        this.setState({
            Attendees: this.state.event.Attendees.push(attendees)
        });
        console.log(this.state.event.Attendees);
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

    joinEventStatus() {
        if (this.state.flag) {
            return false;
        }
        console.log(this.state.event.Attendees);

        var flag2 = false;
        this.state.event.Attendees.forEach((function (item,index) {
            if (this.userInfo.id === item.userID) {
                console.log("true");
                flag2 = true;
                return flag2;
            }
        }).bind(this));
        console.log("false");
        return flag2;
    }

    render() {
        let showUpdate = this.userInfo.email == this.state.event.Hostemail ?
            <button onClick={this.handleUpdateEvent}>Update Event</button> : null;
        let showAttendance = this.joinEventStatus() === false ?
            <button onClick={this.handleJoinEvent}>Join Event</button> : null;

        console.log(this.state.event);
        return (
            <div>
              <div id="main">

                  <h1>Event Name: {this.state.event.Eventname}</h1>
                  <h2>
                      Start date: {(new Date(this.state.event.Startdate)).toLocaleString()}
                      <br/>
                      End date: {(new Date(this.state.event.Enddate)).toLocaleString()}
                      <br/>
                  </h2>
                  <h3>Tags: {this.state.event.Tags}</h3>
                  <h3>Host: {this.state.event.Hostname}</h3>
                  <h3>This is a {this.state.event.Private === true ? "Private": "Public"} event</h3>
                  <p>{this.state.event.Description}</p>
                  <h4>Attendees: {JSON.stringify(this.state.event.Attendees)}</h4>
                  <img src={this.state.event.FlyerURL} height="150" width="150"/>
                  {showUpdate}
                  {showAttendance}
              </div>
            </div>
        );
    }
}
export default Event;
