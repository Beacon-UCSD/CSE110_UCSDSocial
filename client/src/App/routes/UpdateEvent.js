import React from 'react';
import { Link } from 'react-router-dom';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// for http requests
import pfetch from '../fetch.protected';
import auth from '../auth';

const config = require('../../config.json');

const AWS = require('aws-sdk');

const BUCKET = 'ucsdsocial';
const s3 = new AWS.S3({
    accessKeyId: config.AWS_ID,
    secretAccessKey: config.AWS_SECRET
});

class UpdateEvent extends React.Component{
    constructor(props){
        super(props);
        this.userInfo = auth.getUserInfo();

        const {evt} = this.props.location.state;
        
        let evtPrivateBool = false;
        if (evt.Private === 1){
            evtPrivateBool = true;
        }

        this.state = {
            EventID: evt.EventID,
            Eventname: evt.Eventname,
            Description: evt.Description,
            Startdate: new Date(evt.Startdate),
            Enddate: new Date(evt.Enddate),
            Private: evt.Private,
            PrivateBool: evtPrivateBool,
            Public: !evt.Private,
            FlyerURL: evt.FlyerURL,
            objectFile: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        console.log("Check Date object's toString method: " + this.state.endDate);

    }

    //Handler for image file upload
    fileChangedHandler = event => {
        let uploadPic = event.target.files[0];

        this.setState({
            objectFile: uploadPic,
            flyerURL: URL.createObjectURL(event.target.files[0])
        });
    }

    /*
    Handles checkbox changes, so alternates the private and public boxes
    */
    handleInputChange(evt){
        if (evt.target.name === "Private"){
            if (evt.target.checked){
                this.setState({
                    Private: "1",
                    PrivateBool: evt.target.checked,
                    Public: !evt.target.checked,
                })
            }
            else{
                this.setState({
                    Private: "0",
                    PrivateBool: evt.target.checked,
                    Public: !evt.target.checked,
                })
            }
        }
        else{
            if (evt.target.checked){
                this.setState({
                    Private: "0",
                    PrivateBool: !evt.target.checked,
                    Public: evt.target.checked,
                })
            }
            else{
                this.setState({
                    Private: "1",
                    PrivateBool: !evt.target.checked,
                    Public: evt.target.checked,
                })
            }
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
            Startdate: date,
        });
        // Check if start date is after end date, if so update end date.
        if (date > this.state.Enddate) {
            console.log("Changing end date");
            // Set end date to be 5 minutes after start time.
            this.setState({
                Enddate: new Date(date.getTime()+5*60000) // set end date 5 minutes after start date
            });
        }
    }

    /*
    Handles changing the date of the end date
    */
    handleEndDateChange = (date) => {
        console.log('Input Date: ' + date);

        this.setState({
            Enddate: new Date(date),
        })
        console.log(this.state.endDate);
    }


    /*
    Makes POST request to update the event info
    */
    handleSubmit(evt){
        evt.preventDefault();

        this.setState({
            Description: this.state.Description.trim()
        });

        // Check for missing required fields
        var errors = [];
        if (this.state.Description.length < 15) {
            errors.push("Event description must be at least 15 characters long.");
        }
        if (this.state.Startdate < (Date.now()+300000)) {
            errors.push("Event must start at least 5 minutes into the future.");
        }
        if ((this.state.Enddate-this.state.Startdate) < 300000) {
            errors.push("Event must have a duration of at least 5 minutes.");
        }
        /*if (this.state.Tags.length <= 0) {
            errors.push("At least one event tag is required.");
        }*/
        // Check if any errors
        if (errors.length > 0) {
            var err_str = "Error! Cannot post event due to the following errors:";
            for (var i = 0; i < errors.length; i++) {
                err_str += "  - " + errors[i];
            }
            console.error(err_str);
            alert(err_str);

            // Re-enable form
            this.setState({
                formDisabled: false
            });
            return;
        }

        var reader = new FileReader();

        reader.name = this.state.objectFile.name;
        var location = "";
        if(reader.name === undefined || reader.name === null){
            // do nothing
            console.log("no file attached");
            location = this.state.FlyerURL;
        }
        else{
            reader.onload = function(e) {
            var params = {
                Bucket: BUCKET,
                //This is a quick-fix (very bad) prefferably a unique string to the event
                Key: this.name,
                ContentType: 'image/jpeg',
                Body: e.target.result,
                ACL: 'public-read'
            };
            console.log(params);
            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                console.log(`File uploaded successfully at ${data.Location}`);
                });
            };
            reader.readAsArrayBuffer(this.state.objectFile);
    
            location = "https://ucsdsocial.s3.amazonaws.com/" + this.state.objectFile.name;
        }
        console.log("OG " + this.state.FlyerURL);
        console.log("NW " + this.state.objectFile.name);
        console.log("The Location for Flyer is: " + location);


        var body = {
            EventID: this.state.EventID.toString(),
            Startdate: this.state.Startdate.getTime(),
            Enddate: this.state.Enddate.getTime(),
            Private: this.state.Private,
            Description: this.state.Description
        };
        if (typeof(location) != 'undefined') {
            body['FlyerURL'] = location;
        }

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

        console.log("Done Updating ");
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

    render(){
        // Eventname, Date, Starttime, Endtime, Date, tagID, Host, Private, Description, Attendees
        // cannot edit host or attendees
        return(
            <div className="container">
                <form id="main" onSubmit={this.handleSubmit}>
                    <input className="eventName" name="Eventname" type="text" value={this.state.Eventname} readOnly/>
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
                    <div className="create-event-visibility">Event Visibility</div>
                    <label>
                        <input className="Private" name="Private" type="checkbox" checked={this.state.PrivateBool}
                            onChange={this.handleInputChange} />
                        Private
                    </label>
                    <label>
                        <input className="Public" name="Public" type="checkbox" checked={this.state.Public}
                            onChange={this.handleInputChange} />
                        Public
                    </label>
                    <div className="text-center">Upload Flyer Image</div>
                    <input type="file" className="imageupload" onChange={this.fileChangedHandler}/>
                    <img id="testImg" src={this.state.flyerURL} width="150" height="150"/>
                    <input className="submit" type="submit" value="Update Event" />
                </form>
            </div>
        );
    }
}

export default UpdateEvent;
