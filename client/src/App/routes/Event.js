import React, {Component} from "react";
import {Route} from 'react-router-dom';
import { Redirect } from 'react-router-dom';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: {}
        }
    }

    componentDidMount = () =>{
        fetch('/api/getEvent?EventID=' + this.props.match.params.EventID).then(res => res.json()).then(e => {
            this.setState({
                event: e
            })
        })
    }

    handleUpdateEvent(){
    }

    render() {
        return (
            <div>
                <h1>Event Name: {this.state.event.Eventname}</h1>
                <h2>
                    Start date: {this.state.event.Startdate}
                    <br/> 
                    End date: {this.state.event.Enddate}
                    <br/> 
                </h2>
                <h3>Tags: {this.state.event.tagID}</h3>
                <h3>Host: {this.state.event.Host}</h3>
                <h3>This is a {this.state.event.Private === "True" ? "Private": "Public"} event</h3>
                <p>{this.state.event.Description}</p>
                <h4>Attendees: {this.state.event.Attendees}</h4>
                <button onClick={this.handleUpdateEvent}>Update Event</button>
            </div>
        );
    }
}
export default Event;
