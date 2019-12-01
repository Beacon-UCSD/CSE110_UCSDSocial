import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pfetch from '../fetch.protected';

import TagButton from '../components/TagButton';
import './EventFeed.css';

class EventFeed extends Component {

    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: [],
            Tags: []
        }
    }

    // Fetch the event feed on mount
    componentDidMount() {
        /*
        fetch('/api/getList')
        .then(res => res.json())
        .then(list => this.setState({ list }))*/
        pfetch.jsonGet('/api/getList', (list) => {
            this.setState({ list });
        });
    }

	addTag() {
         var tagToAdd = this.refs.tagInputField.value;

         this.setState({
             Tags: [...this.state.Tags, tagToAdd]
         });
         this.refs.tagInputField.value = "";
     }

    render(){
        const { list } = this.state;
        return(
            <div>
                <h1> Event Feed </h1>
                <div id="mySidenav" class="sidenav">
                  <Link to={'/app/Profile'}>
                    <a href="#">Profile</a>
                  </Link>
                  <Link to={'/app/Eventfeed'}>
                    <a href="#">Events</a>
                  </Link>
                  <Link to={'/app/CreateEvent'}>
                    <a href="#">Create Event</a>
                  </Link>
                  <a href="#">Logout</a>
                </div>
            <div className="searchBar">
					 <label>
                         Search:
                         <input name="Tags" type="text" placeholder={"Type tag to filter..."}
                             ref='tagInputField' />
                     </label>
                     <button type='button' onClick={this.addTag.bind(this)}>Add Tag</button>
            </div>
            <div className="tags">
                         {this.state.Tags.map((tag, i) => (
                             <TagButton key={i} tag={tag} />
                         ))}
            </div>
                <div id="main">

                    {list.map((item) => {
						 var userTags = JSON.stringify(this.state.Tags);
                         var parsedUT = JSON.parse(userTags);
                         var parsedET = item.Tags.split(',');

                         if (this.state.Tags.length === 0) {
                             return(
                                 <div key={item.EventID}>
                                 <Link to={'/app/Event/' + item.EventID}>
                                     <button className="eventButton">
                                         <h2>{item.Eventname}</h2>
                                         <h3>Start: {item.Startdate}</h3>
                                         <h3>End: {item.Enddate}</h3>
                                     </button>
                                 </Link>
                                 </div>
                             );
                         } else {
                             for (var i = 0; i < parsedET.length; i++) {
                                 for (var j = 0; j < this.state.Tags.length; j++) {
                                     if (parsedET[i].replace(/[\[\]"]+/gi, '')
                                         === this.state.Tags[j]) {
                                         return(
                                             <div key={item.EventID}>
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
						 }
					  })}
                </div>

                <div>
                </div>
            </div>
        );
    }

}

export default EventFeed;
