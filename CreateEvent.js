
import React, { Component } from 'react';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


class CreateEvent extends Component {


    constructor(props){
        super(props);

        this.state = {
            tagID: '',
            Eventname:'',
            Description:'',
            startDate: new Date(),
            endDate: new Date(),
            Private: "False",
            flyerURL: '',
            Attendees: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        console.log("Check Date object's toString method: " + this.state.endDate);

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

        fetch('/api/storeEvent', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                tagID: this.state.tagID,
                Eventname: this.state.Eventname,
                Host: "Me",
                Startdate: this.state.startDate.toString(),
                Enddate: this.state.endDate.toString(),
                Private: "False",
                Description: this.state.Description,
                FlyerURL: "",
                Attendees: ""
            }),
        });
        this.props.history.push(`/Eventfeed`);
        // go to eventfeed page
    }


    /*
    Form currently handles:
        EventID: Handled in index.js
        Eventname:
        tagID: but not with any tag functionality just a string
        Startdate:
        Enddate:
        Private: Handled automatically as "false"
        Description: 
        FlyerURL: Handled automatically as ""
        Attendees: Handled automatically as ""
    */
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
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
                    <input name="tagID" type="text" value={this.state.tagID} onChange={this.handleChange}/>
                </label>
                <br/>
                <label>
                    Event Description:
                    <input name="Description" type="text" value={this.state.Description} 
                        onChange={this.handleChange} />
                </label>

                <input type="submit" value="Submit" />
            </form>
        );
    }

}

export default CreateEvent;
