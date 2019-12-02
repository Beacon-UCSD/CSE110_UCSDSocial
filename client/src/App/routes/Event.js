import React, {Component} from "react";
import pfetch from '../fetch.protected';
import auth from '../auth';

import { Link } from 'react-router-dom';

class Event extends Component {

    constructor(props) {
        super(props);
        this.userInfo = auth.getUserInfo();

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
                data.Tags = data.Tags.replace(/[\[\]"]+/gi, "").replace(/[,]+/gi, ", ");
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
            Tags: this.state.event.Tags,
        }
        console.log(evt);
        this.props.history.push({
            pathname: '/app/UpdateEvent',
            state:{evt: evt}
        })
    }

    render() {
        console.log(this.state.event);
        let showUpdate = this.userInfo.email == this.state.event.Hostemail ? 
            <button onClick={this.handleUpdateEvent}>Update Event</button> : null;
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
                  <h3>This is a {this.state.event.Private === 1 ? "Private": "Public"} event</h3>
                  <p>{this.state.event.Description}</p>
                  <h4>Attendees: {this.state.event.Attendees}</h4>
                  <img src={this.state.event.FlyerURL} height="150" width="150"/>
                  {showUpdate}
              </div>
            </div>
        );
    }
}
export default Event;
