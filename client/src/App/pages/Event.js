import React, {Component} from "react";

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    render() {
        return (
            <div>
                <h1>{this.props.event.eventName}</h1>
                <div>
                    <label>{this.props.event.host}</label>
                    <label>{this.props.event.Date}</label>
                    <label>{this.props.event.Starttime}</label>
                    <label>{this.props.event.Endtime}</label>
                    <p>{this.props.event.Description}</p>
                    <p>{this.props.event.Attendees}</p>
                    <p>{this.props.event.tagIDs}</p>
                    <label>{this.props.event.FlyerURL}</label>
                </div>
            </div>
        );
    }
}
export default Event;
