import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pfetch from '../fetch.protected';

import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Popper from 'popper.js';

import NavBar from '../components/NavBar';
import TagButton from '../components/TagButton';
import auth from '../auth';

import './EventFeed.css';


class EventFeed extends Component {

    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: [],
            FilterTags: []
        }
        this.userInfo = auth.getUserInfo();
    }

    // Fetch the event feed on mount
    componentDidMount() {
        pfetch.jsonGet('/api/getList', (list) => {
            // Parse all tags for all events.

            for (var i = 0; i < list.length; i++) {
                try {
                    list[i].Tags = JSON.parse(list[i].Tags);
                } catch(e) {
                    list[i].Tags = null;
                }
                try {
                    list[i].Startdate = new Date(list[i].Startdate).getTime();
                } catch(e) {
                    console.error("Cannot parse start date [" + i + "]");
                }
                try{
                    list[i].Enddate = new Date(list[i].Enddate).getTime();
                } catch(e) {
                    console.error("Cannot parse end date [" + i + "]");
                }
            }

            // filter list of private events that aren't the users
            console.log("list before filtering other users' privates:", list)
            list = list.filter(evt => {
                return !(evt.Hostemail != this.userInfo.email && evt.Private === 1);
            });
            console.log("list after filtering other users' privates:", list);
            // Update state
            this.setState({ list });
        });
    }

	addTagToFilter() {
        var tagToAdd = this.refs.tagInputField.value;
        tagToAdd = tagToAdd.toUpperCase();

        if (this.state.FilterTags.indexOf(tagToAdd) != -1) {
            console.log("Tag '" + tagToAdd + "' is already in filter.");
        } else {
             this.setState({
                 FilterTags: [...this.state.FilterTags, tagToAdd]
             });
        }

        this.refs.tagInputField.value = "";
    }

    removeTagFromFilter(tagIndex) {
        // Remove tag
        this.state.FilterTags.splice(tagIndex, 1);
        // Update state
        this.setState({
            FilterTags: this.state.FilterTags
        });
    }


    render(){
        const { list } = this.state;
        return(
        <div>
            <div className="row">
                <div className="col-md-12">
                    <h2>Events Feed</h2>
                </div>
            </div>

            <div className="row text-center">
                <div className="searchBox col-md-12">
                    <label>
                         <input name="Tags" type="text"
                            placeholder={"Type tag to search..."}
                            ref='tagInputField' />
                    </label>
                    <button type='button' onClick={this.addTagToFilter.bind(this)}>Add Tag to Filter</button>
                    <div className="tagBubbles">
                         {this.state.FilterTags.map((tag, i) => (
                             <TagButton key={i} tag={tag} deleteHandler={this.removeTagFromFilter.bind(this, i)} />
                         ))}
                    </div>
                </div>
            </div>

            <div className="eventfeed row d-flex justify-content-center align-items-center">
                {
                    // need to filter out private events that are not the users
                    list.map((item) => {

                    var itemTags = item.Tags;

                    if (this.state.FilterTags.length > 0) {
                        // Filter by tags.

                        if (itemTags == null) return;

                        for (var i = 0; i < itemTags.length; i++) {
                            for (var j = 0; j < this.state.FilterTags.length; j++) {
                                if (itemTags[i].toUpperCase() ===
                                    this.state.FilterTags[j].toUpperCase()) {

                                        // if curr user's private event, show in different color
                                        let eventBtn = item.Hostemail === this.userInfo.email &&
                                            item.Private ?
                                            <div className="private-eventbutton eventButton">
                                                <div className="eventpic">
                                                    <img src={item.FlyerURL} />
                                                </div>
                                                <div className="event-body-container">
                                                    <div className="eventname">{item.Eventname}</div>
                                                    <div className="alt">Event Host: {item.Hostname}</div>
                                                    <div className="desc">{item.Description}</div>
                                                    <div className="datetime">
                                                        <div className="starttime">Start: {(new Date(item.Startdate)).toLocaleString()}</div>
                                                        <div className="endtime">End: {(new Date(item.Enddate)).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div> : 
                                            <div className="eventButton">
                                                <div className="eventpic">
                                                    <img src={item.FlyerURL} />
                                                </div>
                                                <div className="event-body-container">
                                                    <div className="eventname">{item.Eventname}</div>
                                                    <div className="alt">Event Host: {item.Hostname}</div>
                                                    <div className="desc">{item.Description}</div>
                                                    <div className="datetime">
                                                        <div className="starttime">Start: {(new Date(item.Startdate)).toLocaleString()}</div>
                                                        <div className="endtime">End: {(new Date(item.Enddate)).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                        return(
                                        <div key={item.EventID} className="col-md-5">
                                            <Link to={'/app/Event/' + item.EventID}>
                                                {eventBtn}
                                            </Link>
                                        </div>
                                        );
                                }
                            }
                        }

                    } else {
                        // Not filtering, just show everything.
                        // if curr user's private event, show in different color
                        let eventBtn = item.Hostemail === this.userInfo.email &&
                                        item.Private ?
                                        <div className="private-eventbutton eventButton">
                                            <div className="eventpic">
                                                <img src={item.FlyerURL} />
                                            </div>
                                            <div className="event-body-container">
                                                <div className="eventname">{item.Eventname}</div>
                                                <div className="alt">Event Host: {item.Hostname}</div>
                                                <div className="desc">{item.Description}</div>
                                                <div className="datetime">
                                                    <div className="starttime">Start: {(new Date(item.Startdate)).toLocaleString()}</div>
                                                    <div className="endtime">End: {(new Date(item.Enddate)).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div> : 
                                        <div className="eventButton">
                                            <div className="eventpic">
                                                <img src={item.FlyerURL} />
                                            </div>
                                            <div className="event-body-container">
                                                <div className="eventname">{item.Eventname}</div>
                                                <div className="alt">Event Host: {item.Hostname}</div>
                                                <div className="desc">{item.Description}</div>
                                                <div className="datetime">
                                                    <div className="starttime">Start: {(new Date(item.Startdate)).toLocaleString()}</div>
                                                    <div className="endtime">End: {(new Date(item.Enddate)).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                        return(
                        <div key={item.EventID} className="col-md-5">
                            <Link to={'/app/Event/' + item.EventID}>
                                {eventBtn}
                            </Link>
                        </div>
                        );
                    }

                })}
            </div>
        </div>
        );
    }

}

export default EventFeed;
