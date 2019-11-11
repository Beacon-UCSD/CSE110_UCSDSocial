import React, {Component} from "react";

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

    render() {
        return (
            <div>
                <h1>Event Name: {this.state.event.Eventname}</h1>
                <h2>
                    Date: {this.state.event.Date}
                    <br/> 
                    Start Time: {this.state.event.Starttime}
                    <br/> 
                    End Time: {this.state.event.Endtime}
                    <br/> 
                </h2>
                <h3>Tags: {this.state.event.tagID}</h3>
                <h3>Host: {this.state.event.Host}</h3>
                <h3>This is a {this.state.event.Private === "True" ? "Private": "Public"} event</h3>
                <p>{this.state.event.Description}</p>
                <h4>Attendees: {this.state.event.Attendees}</h4>

            </div>
        );
    }
}
export default Event;
