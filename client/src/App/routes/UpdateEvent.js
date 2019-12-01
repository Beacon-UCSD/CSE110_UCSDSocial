import React from 'react';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// for http requests
import pfetch from '../fetch.protected';
import { Link } from 'react-router-dom';

class UpdateEvent extends React.Component{
    constructor(props){
        super(props);
        const {evt} = this.props.location.state;
        this.state = {
            Tags: '',
            Eventname: evt.Eventname,
            Description: evt.Description,
            Startdate: evt.Startdate,
            Enddate: evt.Enddate,
            Private: evt.Private,
            Public: !evt.Private,
            flyerURL: '',
            Attendees: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /*
    Handles changes of any basic input text
    */
    handleChange(event) {
        // decide whether the event name or description attribute is being changed
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
    }

    /*
    Handles changing the date of the start date
    */
    handleStartDateChange = (date) => {
        console.log(date);
        this.setState({
            Startdate: new Date(+date),
        })
    }

    /*
    Handles changing the date of the end date
    */
    handleEndDateChange = (date) => {
        console.log('Input Date: ' + date);

        this.setState({
            Enddate: new Date(+date),
        })
        console.log(this.state.endDate);
    }

    /*
    Handles checkbox changes, so alternates the private and public boxes
    */
    handleInputChange(evt){
        if (evt.target.name === "Private"){
            this.setState({
                Private: evt.target.checked,
                Public: !evt.target.checked,
            })
        }
        else{
            this.setState({
                Private: !evt.target.checked,
                Public: evt.target.checked,
            })
        }
    }

    /*
    Makes POST request to update the event info
    */
    handleSubmit(evt){
        // TODO: is there an endpoint for updating event?
        var body = {
            Tags: this.state.Tags,
            Eventname: this.state.Eventname,
            Host: "Me",
            Startdate: this.state.Startdate.toString(),
            Enddate: this.state.Enddate.toString(),
            Private: this.state.Private,
            Description: this.state.Description,
            FlyerURL: "",
            Attendees: ""
        };
        pfetch.jsonPost('/api/storeEvent', body);
        this.props.history.push('/app/Eventfeed');
    }

    render(){
        // Eventname, Date, Starttime, Endtime, Date, tagID, Host, Private, Description, Attendees
        // cannot edit host or attendees
        return(
            <div className="container">
                <form id="main" onSubmit={this.handleSubmit}>
                    <input className="eventName" name="Eventname" type="text" value={this.state.Eventname}
                        onChange={this.handleChange}/>
                    <input className="description" name="Description" type="text" value={this.state.Description}
                        onChange={this.handleChange}/>
                    <MuiPickersUtilsProvider
                        className='date-picker'
                        utils={DateFnsUtils}>
                            <DateTimePicker
                                name ='Startdate'
                                label='Choose a start time'
                                value={this.state.Startdate}
                                onChange={this.handleStartDateChange}/>
                            <DateTimePicker
                                name='Enddate'
                                label='Choose an end time'
                                value={this.state.Enddate}
                                onChange={this.handleEndDateChange} />
                    </MuiPickersUtilsProvider>
                    <br/>
                    <label>
                        <input className="Private" name="Private" type="checkbox" checked={this.state.Private}
                            onChange={this.handleInputChange} />
                        Private
                    </label>
                    <label>
                        <input className="Public" name="Public" type="checkbox" checked={this.state.Public}
                            onChange={this.handleInputChange} />
                        Public
                    </label>
                    <input className="submit" type="submit" value="Update Event" />
                </form>
            </div>
        );
    }
}

export default UpdateEvent;
