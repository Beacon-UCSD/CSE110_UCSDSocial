
import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class EventFeed extends Component {

    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            list: []
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
                <div>
                  {item}
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
