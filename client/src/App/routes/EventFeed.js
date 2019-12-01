import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pfetch from '../fetch.protected';

import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Popper from 'popper.js';

import NavBar from '../components/NavBar';
import TagButton from '../components/TagButton';

import './EventFeed.css';


class EventFeed extends Component {

    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: [],
            FilterTags: []
        }
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
            }
            // Update state
            this.setState({ list });
        });
    }

	addTagToFilter() {
         var tagToAdd = this.refs.tagInputField.value;

         this.setState({
             FilterTags: [...this.state.FilterTags, tagToAdd]
         });
         this.refs.tagInputField.value = "";
     }

    render(){
        const { list } = this.state;
        return(
        <div>
            <div className="row">
                <div className="col-8">
                    <h2> Your Events </h2>
                </div>
                <div className="col-md-4">
                        <Link to={'/app/CreateEvent'}>
                        <button variant="raised"> Create Event </button>
                    </Link>
                </div>
            </div>

            <div className="searchBar row">
                <div className="col-md-12">
                    <label>
                        Search:
                         <input name="Tags" type="text"
                            placeholder={"Type tag to filter..."}
                            ref='tagInputField' />
                    </label>
                    <button type='button' onClick={this.addTagToFilter.bind(this)}>Add Tag to Filter</button>
                    <div className="tagBubbles">
                         {this.state.FilterTags.map((tag, i) => (
                             <TagButton key={i} tag={tag} />
                         ))}
                    </div>
                </div>
            </div>

            <div className="row">
                {list.map((item) => {

                    var itemTags = item.Tags;
                    
                    if (this.state.FilterTags.length > 0) {
                        // Filter by tags.
                        
                        if (itemTags == null) return;

                        for (var i = 0; i < itemTags.length; i++) {
                            for (var j = 0; j < this.state.FilterTags.length; j++) {
                                if (itemTags[i].toUpperCase() ===
                                    this.state.FilterTags[j].toUpperCase()) {
                                    return(
                                    <div key={item.EventID} className="col-md-12">
                                        <Link to={'/app/Event/' + item.EventID}>
                                            <button className="eventButton">
                                                <h2>{item.Eventname}</h2>
                                                <h3>Start: {item.Startdate}</h3>
                                                <h3>End: {item.Enddate}</h3>
                                            </button>
                                        </Link>
                                    </div>
                                    );
                                }
                            }
                        }

                    } else {
                        // Not filtering, just show everything.
                        
                        return(
                        <div key={item.EventID} className="col-md-12">
                            <Link to={'/app/Event/' + item.EventID}>
                                <button className="eventButton">
                                    <h2>{item.Eventname}</h2>
                                    <h3>Start: {item.Startdate}</h3>
                                    <h3>End: {item.Enddate}</h3>
                                </button>
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
