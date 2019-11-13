
import React, { Component } from 'react';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {Route} from 'react-router-dom';

class CreateEvent extends Component {


    constructor(props){
        super(props);

        this.state = {
            nameValue:'',
            descriptionValue:'',
            startDate: new Date(),
            endDate: new Date(),
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        // decide whether the event name or description attribute is being changed
        const name = target.name;
        
        this.setState({
            [name]: event.target.value
        });
    }

    handleStartDateChange = (date) => {
        this.setState({
            startTime: new Date(+date),
        })
    }

    handleEndDateChange = (date) => {
        this.setState({
            endTime: new Date(+date),
        })
    }

    handleSubmit(event){
        event.preventDefault();

        // host depends on username after we do auth?
        event = {
            host: 'me',
            eventName: this.state.nameValue,
            eventDescription: this.state.descriptionValue,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            attendees: [],
            tagIds: [],
            flyerURL: 'https://google.com'
        }

        fetch('/api/test',{method:"POST",body:{'eventData':event}})

        // go to the created event's page
        return <Route
                    path='/event'
                    render={(props) => <Event event={event} />} 
                />
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Event Name:
                    <input name="nameValue" type="text" value={this.state.nameValue} 
                        onChange={this.handleChange} />
                </label>
                <label>
                    Event Description:
                    <input name="descriptionValue" type="text" value={this.state.descriptionValue} 
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
                <input type="submit" value="Submit" />
            </form>
        );
    }

}

export default CreateEvent;
