import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';


class EventFeed extends Component {

    // Initialize the state
    constructor(props){

        super(props);
        this.state = {
            list: []
        }

        //redirect to user to login if not logged in
        if ( typeof( Cookies.get('user_email') ) == "undefined" ) {
            this.props.history.push('/')
        }

    }

    // Fetch the event feed on mount
    componentDidMount() {
        fetch('/api/getList')
        .then(res => res.json())
        .then(list => this.setState({ list }))
    }

    render(){
      const { list } = this.state;
      return(
        <div>
            <h1> Event Feed. </h1>
        <div>
            {list.map((item) => {
              return(
                <div key={item.EventID}>
                  <Link to={'./Event/' + item.EventID}>
                    <button>
                      <h2>{item.Eventname}</h2>
                      <p>{item.Date}</p>
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        <div>
            <Link to={'./CreateEvent'}>
            <button variant="raised"> Create Event </button>
            </Link>
        </div>
        </div>
        );
    }

}

export default EventFeed;
