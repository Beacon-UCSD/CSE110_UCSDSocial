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
              <div className="background-profile">
                <img className="profile" src={this.userInfo.pictureSrc}/>
                <h2>{this.userInfo.name}</h2>
                <div className="info">
                  <h3>Email:<h4>{this.userInfo.email}</h4></h3>
                  <h3>Phone Number:<h4>{this.state.event.Phone}</h4></h3>
                  <h3>Tag IDs:<h4>{this.state.event.tagIDs}</h4></h3>
                  <h3>College:<h4>{this.state.event.College}</h4></h3>
                  <h3>Major:<h4>{this.state.event.Major}</h4></h3>
                  <h3>Year:<h4>{this.state.event.Year}</h4></h3>
                  <h3>Friends:<h4>{this.state.event.Friends}</h4></h3>
                  <h3>Host Events:<h4>{this.state.event.Hostevents}</h4></h3>
                  <h3>Notifications:<h4>{this.state.event.Notifications}</h4></h3>
                </div>
              </div>
            </div>
          );
     }
 }
 export default Profile;
