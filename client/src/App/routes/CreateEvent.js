
import React, { Component } from 'react';


class CreateEvent extends Component {


    constructor(props){

        super(props);
        this.state = {value:''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();

        fetch('/api/test',{method:"POST",body:{'eventDataa':this.state}})

    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Event Name:
                    <input type="text" value={this.state.value} 
                        onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }

}

export default CreateEvent;
