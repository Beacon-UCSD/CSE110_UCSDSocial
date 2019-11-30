import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// for http requests
import pfetch from '../fetch.protected';

import TagButton from '../components/TagButton';

import './CreateEvent.css';

class CreateEvent extends Component {

    constructor(props){
        super(props);

        this.state = {
            Tags: [],
            Eventname:'',
            Description:'',
            startDate: new Date(),
            endDate: new Date(),
            Private: false,
            Public: true,
            flyerURL: '',
            Attendees: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        console.log("Check Date object's toString method: " + this.state.endDate);

    }

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

    handleChange(event) {
        // decide whether the event name or description attribute is being changed
        const name = event.target.name;

        this.setState({
            [name]: event.target.value
        });
    }

    handleStartDateChange = (date) => {
        console.log(date);
        this.setState({
            startDate: new Date(+date),
        })
    }
    handleEndDateChange = (date) => {
        console.log('Input Date: ' + date);

        this.setState({
            endDate: new Date(+date),
        })
        console.log(this.state.endDate);
    }

    handleCreateEvent(event){
        //event.preventDefault();

        var body = {
            Tags: this.state.Tags,
            Eventname: this.state.Eventname,
            Host: "Me",
            Startdate: this.state.startDate.toString(),
            Enddate: this.state.endDate.toString(),
            Private: this.state.Private,
            Description: this.state.Description,
            FlyerURL: "",
            Attendees: ""
        };
        pfetch.jsonPost('/api/storeEvent', body);
        // go to eventfeed page
        this.props.history.push('/app/Eventfeed');
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

        if (this.state.Tags.indexOf(tagToAdd) != -1) {
            console.log("The tag '" + tagToAdd + "' is already added to the event.");
        } else {
            // Add Tag
            this.setState({
                Tags: [...this.state.Tags, tagToAdd]
            });
        }

        this.refs.tagInputField.value = "";
    }


    /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    /*
    Form currently handles:
        EventID: Handled in index.js
        Eventname:
        Tags: but not with any tag functionality just a string
        Startdate:
        Enddate:
        Private: Handled automatically as "false"
        Description:
        FlyerURL: Handled automatically as ""
        Attendees: Handled automatically as ""
    */
    render(){
        return(
          <div>

            <div id="mySidenav" class="sidenav">
              <a href="/app/Profile">Profile</a>
              <a href="/app/Eventfeed">Events</a>
              <a href="/app/CreateEvent">Create Event</a>
              <a href="/app/Profile">Logout</a>
            </div>

            <div id="main">
              <form className="eventForm" onSubmit={this.handleSubmit}>
                <label>
                    <input className="eventName" name="Eventname" type="text" value={this.state.Eventname}
                        onChange={this.handleChange} placeholder="Event Name" />
                </label>
                <MuiPickersUtilsProvider
                    className='date-picker'
                    utils={DateFnsUtils}>
                        <DateTimePicker
                            name ='startDate'
                            label='Choose a start time'
                            value={this.state.startDate}
                            onChange={this.handleStartDateChange}/>
                        <DateTimePicker
                            name='endDate'
                            label='Choose an end time'
                            value={this.state.endDate}
                            onChange={this.handleEndDateChange} />
                </MuiPickersUtilsProvider>
                <br/>
                <label>
                    <input className="tag" name="Tags" type="text" placeholder={"Type tag to add..."}
                        ref='tagInputField' />
                    <br/>
                    <button className="tags" type='button' onClick={this.addTag.bind(this)}>Add Tag</button>
                </label>

                <div ref='eventTags'>
                    {this.state.Tags.map((tag, i) => (
                        <TagButton key={i} tag={tag} />
                    ))}
                </div>
                <br/>
                <label>

                    <input className="description" name="Description" type="text" value={this.state.Description}
                        onChange={this.handleChange} placeholder="Event Description" />
                </label>
                <label>
                        <input class="Private" name="Private" type="checkbox" checked={this.state.Private}
                            onChange={this.handleInputChange} />
                        Private
                </label>
                <label>
                        <input class="Public" name="Public" type="checkbox" checked={this.state.Public}
                            onChange={this.handleInputChange} />
                        Public
                </label>
                <input className="submit" type="submit" value="Submit" />
            </form>
            </div>
          </div>
        );
    }

}

/* Set the width of the side navigation to 250px */

export default CreateEvent;
