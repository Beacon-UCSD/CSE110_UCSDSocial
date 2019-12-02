import React, { Component } from 'react';
import auth from '../auth';
import { Link } from 'react-router-dom';
// for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// for http requests
import pfetch from '../fetch.protected';

import TagButton from '../components/TagButton';

import './CreateEvent.css';

const AWS = require('aws-sdk');
const ID = 'AKIAQI57SY65EFA5UHTF';
const SECRET = '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';

const BUCKET = 'ucsdsocial';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

class CreateEvent extends Component {

    constructor(props){
        super(props);
        this.userInfo = auth.getUserInfo();

        this.state = {
            // Set to true to disable form from being able to be submitted and
            // from being able to update component state.
            disableForm: false,

            Tags: [],
            Eventname:'',
            Description:'',
            startDate: new Date(Date.now()+3600000), // default start date = 1 hour from now
            endDate: new Date(Date.now()+5400000), // default end date = 30 minutes after start time
            Private: "0",
            PrivateBool: false,
            Public: true,
            flyerURL: "https://ucsdsocial.s3.amazonaws.com/Default.png",
            Attendees: '',
            objectFile: {}
        };

        this.handleCreateEvent = this.handleCreateEvent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
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
            /*
            this.setState({
                Private: "1",
                PrivateBool: evt.target.checked,
                Public: !evt.target.checked,
            })
            */

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
            /*
            this.setState({
                Private: "0",
                PrivateBool: !evt.target.checked,
                Public: evt.target.checked,
            })
            */
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
            startDate: date
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
    handleEndDateChange = (date) => {
        console.log('Input Date: ' + date);

        this.setState({
            endDate: new Date(+date),
        });
        console.log(this.state.endDate);
    }

    handleCreateEvent(event){
        // Prevent page from refresh
        event.preventDefault();

        // Prevent form from being submitted when disabled.
        if (this.state.formDisabled) {
            return;
        }

        // Disable form.
        this.setState({
            formDisabled: true
        });

        // Remove whitespace at beginning and end of event name/description.
        this.setState({
            Eventname: this.state.Eventname.trim(),
            Description: this.state.Description.trim()
        });

        // Check for missing required fields
        var errors = [];
        if (this.state.Eventname.length < 5) {
            errors.push("Event name must be at least 5 characters long.");
        }
        if (this.state.Description.length < 15) {
            errors.push("Event description must be at least 15 characters long.");
        }
        if (this.state.startDate < (Date.now()+300000)) {
            errors.push("Event must start at least 5 minutes into the future.");
        }
        if ((this.state.endDate-this.state.startDate) < 300000) {
            errors.push("Event must have a duration of at least 5 minutes.");
        }
        if (this.state.Tags.length <= 0) {
            errors.push("At least one event tag is required.");
        }
        // Check if any errors
        if (errors.length > 0) {
            console.error("Error! Cannot post event due to the following errors:");
            for (var i = 0; i < errors.length; i++) {
                console.error("  - " + errors[i]);
            }

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
            location = "https://ucsdsocial.s3.amazonaws.com/Default.png";
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
        

        var reqParams = {
            Tags: this.state.Tags,
            Eventname: this.state.Eventname,
            Host: this.userInfo.name,
            Hostemail: this.userInfo.email,
            Startdate: this.state.startDate.getTime(),
            Enddate: this.state.endDate.getTime(),
            Private: this.state.Private,
            Description: this.state.Description,
            FlyerURL: location,
            Attendees: ""
        };
        console.log(reqParams);
        pfetch.jsonPost('/api/storeEvent', reqParams, (json) => {
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
            console.log(reqParams);
            // Redirect to events feed page.
            this.props.history.push('/app/Eventfeed');
        });
    }


    addTag() {
        var tagToAdd = this.refs.tagInputField.value;
        // Clean up tag to only have letters and numbers
        tagToAdd = tagToAdd.replace(/[^\s\dA-Z]/gi, '').replace(/ /g, '');
        if (tagToAdd.length <= 2) {
            console.error("Tag must be at least 3 characters long.");
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

    removeTag(tagIndex) {
        // Remove tag
        this.state.Tags.splice(tagIndex, 1);
        // Update state
        this.setState({
            Tags: this.state.Tags
        });
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

            <div id="main">
              <form className="eventForm" onSubmit={this.handleCreateEvent}>
                <label>
                    <input className="eventName" name="Eventname" type="text" value={this.state.Eventname}
                        onChange={this.handleChange} placeholder="Event Name" disabled={this.state.formDisabled} />
                </label>
                <label>

                    <input className="description" name="Description" type="text" value={this.state.Description}
                        onChange={this.handleChange} placeholder="Event Description" disabled={this.state.formDisabled} />
                </label>
                <MuiPickersUtilsProvider
                    className='date-picker'
                    utils={DateFnsUtils}>
                        <DateTimePicker
                            name ='startDate'
                            label='Choose a start time'
                            value={this.state.startDate}
                            onChange={this.handleStartDateChange}
                            disabled={this.state.formDisabled} />
                        <DateTimePicker
                            name='endDate'
                            label='Choose an end time'
                            value={this.state.endDate}
                            onChange={this.handleEndDateChange}
                            disabled={this.state.formDisabled} />
                </MuiPickersUtilsProvider>
                <br/>
                <label>
                    <input className="tag" name="Tags" type="text" placeholder={"Type tag to add..."}
                        ref='tagInputField' disabled={this.state.formDisabled} />
                    <br/>
                    <button className="tags" type='button'
                        onClick={this.addTag.bind(this)}
                        disabled={this.state.formDisabled}>Add Tag</button>
                </label>

                <div ref='eventTags'>
                    {this.state.Tags.map((tag, i) => (
                        <TagButton key={i} tag={tag} deleteHandler={this.removeTag.bind(this, i)}/>
                    ))}
                </div>
                <br/>
                <label>
                        <input className="Private" name="Private" type="checkbox" checked={this.state.PrivateBool}
                            onChange={this.handleInputChange} disabled={this.state.formDisabled} />
                        Private
                </label>
                <label>
                        <input className="Public" name="Public" type="checkbox" checked={this.state.Public}
                            onChange={this.handleInputChange} disabled={this.state.formDisabled} />
                        Public
                </label>
                <input type="file" onChange={this.fileChangedHandler}/>
                <img id="testImg" src={this.state.flyerURL} width="150" height="150"/>
                <input className="submit" type="submit" value="Submit" disabled={this.state.formDisabled} />
            </form>
            </div>
          </div>
        );
    }

}

/* Set the width of the side navigation to 250px */

export default CreateEvent;
