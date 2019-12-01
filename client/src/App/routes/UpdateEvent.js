import React from 'react';
import { Link } from 'react-router-dom';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// for http requests
import pfetch from '../fetch.protected';
import auth from '../auth';

class UpdateEvent extends React.Component{
    constructor(props){
        super(props);
        this.userInfo = auth.getUserInfo();

        const {evt} = this.props.location.state;
        
        this.state = {
            Tags: '',
            Eventname: evt.Eventname,
            Description: evt.Description,
            Startdate: evt.Startdate,
            Enddate: evt.Enddate,
            Private: evt.Private,
            Public: !evt.Private,
            FlyerURL: evt.FlyerURL,
            Attendees: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        console.log("Check Date object's toString method: " + this.state.endDate);

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
    Handles changes of any basic input text
    */
    handleChange(evt) {
        // decide whether the event name or description attribute is being changed
        const name = evt.target.name;
        this.setState({
            [name]: evt.target.value
        });
    }

    /*
    Handles changing the date of the start date
    */
    handleStartDateChange = (date) => {
        console.log(date);
        this.setState({
            Startdate: new Date(+date),
        });
        // Check if start date is after end date, if so update end date.
        if (date > this.state.endDate) {
            console.log("Changing end date");
            // Set end date to be 5 minutes after start time.
            this.setState({
                endDate: new Date(date.getTime()+5*60000) // set end date 5 minutes after start date
            });
        }
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
    Makes POST request to update the event info
    */
    handleSubmit(evt){
        evt.preventDefault();

        this.setState({
            Eventname: this.state.Eventname.trim(),
            Description: this.state.Description.trim()
        });
        // TODO: is there an endpoint for updating event?
        var body = {
            Tags: this.state.Tags,
            Eventname: this.state.Eventname,
            Host: this.userInfo.name,
            Startdate: this.state.Startdate.toString(),
            Enddate: this.state.Enddate.toString(),
            Private: this.state.Private,
            Description: this.state.Description,
            FlyerURL: this.state.FlyerURL,
            Attendees: ""
        };

        console.log("updating: " + this.state.Eventname);

        pfetch.jsonPost('/api/updateEvent', body, (json) => {
            if (!json.success) {
                console.error("Error! Could not post event.");
                if ('message' in json) {
                    console.error(json.message);
                }
                // Re-enable form.
                this.setState({
                    formDisabled: false
                });
                return;
            }
            // Redirect to events feed page.
            this.props.history.push('/app/Eventfeed');
        });
    }

    addTag() {
        var tagToAdd = this.refs.tagInputField.value;
        // Clean up tag to only have letters and numbers
        tagToAdd = tagToAdd.replace(/[^\s\dA-Z]/gi, '').replace(/ /g, '');
        if (tagToAdd.length <= 3) {
            console.error("Tag must be at least 4 characters long.");
            return;
        }

        // Convert tag to uppercase.
        tagToAdd = tagToAdd.toUpperCase();

        if (this.state.Tags.indexOf(tagToAdd) !== -1) {
            console.log("The tag '" + tagToAdd + "' is already added to the event.");
        } else {
            // Add Tag
            this.setState({
                Tags: [...this.state.Tags, tagToAdd]
            });
        }

        this.refs.tagInputField.value = "";
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
