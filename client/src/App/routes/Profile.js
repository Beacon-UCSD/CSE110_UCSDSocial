import React, {Component} from "react";
import auth from '../auth';
import pfetch from '../fetch.protected';
import './Profile.css'

class Profile extends Component {

     constructor(props) {
         super(props);

         // Gets basic user info (name, email, and profile pic)
         this.userInfo = auth.getUserInfo();

         this.state = {
             event: {}
         }
     }

     componentDidMount() {
         pfetch.jsonGet('/api/getUsers', (data) => {
             //this.setState({list});
             this.setState({ event: data });
         });
     }

     render() {
         return (
             <div key={this.state.event.UserID}>
                <img src={this.userInfo.pictureSrc} alt={"You, "+this.userInfo.name} height={"100"} width={"100"} />
                <h1>{this.userInfo.name}</h1>
                <h3>Email:</h3>
                <h4>{this.userInfo.email}</h4>
                <h3>Phone Number:</h3>
                <h4>{this.state.event.Phone}</h4>
                <h3>Tag IDs:</h3>
                <h4>{this.state.event.tagIDs}</h4>
                <h3>College:</h3>
                <h4>{this.state.event.College}</h4>
                <h3>Major:</h3>
                <h4>{this.state.event.Major}</h4>
                <h3>Year:</h3>
                <h4>{this.state.event.Year}</h4>
                <h3>Friends:</h3>
                <h4>{this.state.event.Friends}</h4>
                <h3>Host Events:</h3>
                <h4>{this.state.event.Hostevents}</h4>
                <h3>Notifications:</h3>
                <h4>{this.state.event.Notifications}</h4>
              </div>
          );
     }
 }
 export default Profile;
