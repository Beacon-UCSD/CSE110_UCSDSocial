import React from 'react';
import pfetch from '../fetch.protected';

class UpdateProfile extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props);
        const {data} = this.props.location.state;

        this.state = {
            name:      data.name,
            picture:   data.picture,
            email:     data.email,
            phone:     data.phone,
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

    handleSubmit(evt){
        evt.preventDefault();

        // checking input
        if (this.state.name == ""){
            alert("You must have a name!")
            return;
        }
        // check for only numbers in phone number
        if (this.state.phone.replace(/[0-9\-()]/gi, "") != ""){
            alert("Your phone number must only include numbers");
            return;
        }
        // check for valid phone number length
        else if (this.state.phone.replace(/[^0-9]/gi, "").length != 10){
            console.log(this.state.phone.replace(/[^0-9]/gi, "").length);
            alert("Not a valid phone number!");
            return;
        }

        const body = {
            Name: this.state.name,
            Phone: this.state.phone.replace(/[^0-9]/gi, ""),
            College: this.state.college,
            Major: this.state.major,
            Year: this.state.year
        }

        pfetch.jsonPost('/api/updateMyProfile', body, (json) => {
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
            this.props.history.push('/app/Profile');
        });
    }

    render(){
        return(
            <div className="container">
                <img alt={this.state.name} src={this.state.picture} />
                <form id="main" onSubmit={this.handleSubmit.bind(this)}>
                    <label>
                        Name
                        <input className="name" name="name" type="text" value={this.state.name}
                                onChange={this.handleChange.bind(this)}/>
                    </label>
                    <label>
                        Phone
                        <input className="phone" name="phone" type="text" value={this.state.phone}
                                onChange={this.handleChange.bind(this)}/>
                    </label>
                    <label>
                        College
                        <input className="college" name="college" type="text" value={this.state.college}
                                onChange={this.handleChange.bind(this)}/>
                    </label>
                    <label>
                        Year
                        <input className="year" name="year" type="text" value={this.state.year}
                                onChange={this.handleChange.bind(this)}/>
                    </label>
                    <label>
                        Major
                        <input className="major" name="major" type="text" value={this.state.major}
                                onChange={this.handleChange.bind(this)}/>
                    </label>
                    <br/>
                    <input className="submit" type="submit" value="Update Profile" />    
                </form>
            </div>
        );
    }
}

export default UpdateProfile;
