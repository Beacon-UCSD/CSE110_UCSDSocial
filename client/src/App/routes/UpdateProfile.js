import React from 'react';

class UpdateProfile extends React.Component{
    constructor(props){
        super(props);
        const {data} = this.props.location.state;

        this.state = {
            name:      data.name,
            picture:   data.picture,
            email:     data.email,
            phone:     "",
            tags:      data.tags,
            college:   data.college,
            major:     data.major,
            year:      data.year,
            friends:   "",
            events:    [],
            notifications: []
        };


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

    render(){
        console.log(this.state);
        return(
            <div className="container">
                <form id="main" onSubmit={this.handleSubmit}>
                    {
                        this.state.name == "" ? 
                        <input className="name" name="name" type="text" value="Name"
                            onChange={this.handleChange.bind(this)}/> :
                        <input className="name" name="name" type="text" value={this.state.name}
                            onChange={this.handleChange.bind(this)}/>
                    }
                    {
                        this.state.college == "" ? 
                        <input className="college" name="college" type="text" value="College"
                            onChange={this.handleChange.bind(this)}/> : 
                        <input className="college" name="college" type="text" value={this.state.college}
                            onChange={this.handleChange.bind(this)}/>
                    }

                    {
                        this.state.year == "" ? 
                        <input className="year" name="year" type="text" value="Year"
                            onChange={this.handleChange.bind(this)}/> :                            
                        <input className="year" name="year" type="text" value={this.state.year}
                            onChange={this.handleChange.bind(this)}/>
                    }
                    {
                        this.state.major == "" ?
                        <input className="major" name="major" type="text" value="Major"
                            onChange={this.handleChange}/> : 
                        <input className="major" name="major" type="text" value={this.state.major}
                            onChange={this.handleChange}/>
                    }
                    
                    <br/>
                    <input className="submit" type="submit" value="Update Event" />    
                </form>
            </div>
        );
    }
}

export default UpdateProfile;