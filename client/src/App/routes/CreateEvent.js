import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// for http requests
import pfetch from '../fetch.protected';

import './CreateEvent.css';

class CreateEvent extends Component {


    constructor(props){
        super(props);
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);

        this.state = {
            Tags: '',
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
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event){
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

    openNav() {
      document.getElementById("mySidenav").style.width = "166px";
      document.getElementById("main").style.marginLeft = "166px";
    }

    /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
    }
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
          <body>

            <div id="mySidenav" class="sidenav">
              <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
              <Link to={'/app/Profile'}>
                <a href="#">Profile</a>
              </Link>
              <Link to={'/app/Eventfeed'}>
                <a href="#">Events</a>
              </Link>
              <a href="#">Notification</a>
              <a href="#">Logout</a>
            </div>

            <div id="main">
              <button onClick={this.openNav}>Open</button>
              <button onClick={this.closeNav}>Close</button>
              <form className="eventForm" onSubmit={this.handleSubmit}>
                <label className="eventName">
                    Event Name:
                    <input name="Eventname" type="text" value={this.state.Eventname}
                        onChange={this.handleChange} />
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
                    Tags:
                    <input name="Tags" type="text" value={this.state.tagID} onChange={this.handleChange}/>
                </label>
                <br/>
                <label>
                    Event Description:
                    <input name="Description" type="text" value={this.state.Description}
                        onChange={this.handleChange} />
                </label>
                <label>
                        <input name="Private" type="checkbox" checked={this.state.Private}
                            onChange={this.handleInputChange} />
                        Private
                    </label>
                    <label>
                        <input name="Public" type="checkbox" checked={this.state.Public}
                            onChange={this.handleInputChange} />
                        Public
                    </label>
                <input className="submit" type="submit" value="Submit" />
            </form>
            </div>
          </body>
        );
    }

}

/* Set the width of the side navigation to 250px */

export default CreateEvent;
