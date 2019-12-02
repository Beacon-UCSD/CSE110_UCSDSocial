import React, {Component} from "react";
import auth from '../auth';
import pfetch from '../fetch.protected';
import './Profile.css'
import { Link } from 'react-router-dom';

class Profile extends Component {

     constructor(props) {
         super(props);

         // Gets basic user info (name, email, and profile pic)
         this.userInfo = auth.getUserInfo();

         this.state = {
             name:      this.userInfo.name,
             picture:   this.userInfo.pictureSrc,
             email:     this.userInfo.email,
             phone:     "",
             tags:      [],
             college:   "",
             major:     "",
             year:      "",
             friends:   "",
             events:    [],
             notifications: []
         };

         this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
     }

     componentDidMount() {
         pfetch.jsonGet('/api/getMyProfile', (user) => {
             // Init null fields to empty string/array
             for (var key in user) {
                 if (user[key] == null) {
                     if (key == 'Tags' || key == 'Notifications' ||
                         key == 'Events' || key == 'Friends') {
                         user[key] = [];
                     } else {
                         user[key] = "";
                     }
                 }
             }
             this.setState({
                 name:  user.Name,
                 picture:   this.state.picture,
                 email:     user.Email,
                 phone:     user.Phone,
                 tags:      user.Tags,
                 college:   user.College,
                 major:     user.Major,
                 year:      user.Year,
                 friends:   user.Friends,
                 events:    user.Events,
                 notifications: user.Notifications
             });
             //this.setState({ event: data });
         });
     }

     handleUpdateProfile(evt){
         let profileData = {
             userId: this.state.UserID,
             picture: this.state.picture,
             name: this.state.name,
             tags: this.state.tags,
             college: this.state.college,
             major: this.state.major,
             year: this.state.year,
         }
         this.props.history.push({
            pathname: '/app/UpdateProfile',
            state:{data: profileData}
        })
     }

     render() {
         return (

             <div key={this.state.UserID}>

              <div id="main" className="background-profile">
                <img className="profile" src={this.state.picture}/>
                <h2 className="title">{this.state.name}</h2>
                <div className="info">
                  <div className="actualInfo">Email:<div className="h7">{this.state.email}</div></div>
                  <div className="actualInfo">Phone Number:<div className="h7">{this.state.phone}</div></div>
                  <div className="actualInfo">Tags:<div className="h7">{this.state.tags}</div></div>
                  <div className="actualInfo">College:<div className="h7">{this.state.college}</div></div>
                  <div className="actualInfo">Major:<div className="h7">{this.state.major}</div></div>
                  <div className="actualInfo">Year:<div className="h7">{this.state.year}</div></div>
                  <div className="actualInfo">Friends:<div className="h7">{this.state.friends}</div></div>
                  <div className="actualInfo">Host Events:<div className="h7">{this.state.events}</div></div>
                  <div className="actualInfo">Notifications:<div className="h7">{this.state.notifications}</div></div>
                  <button onClick={this.handleUpdateProfile}>Update Profile</button>
                </div>
              </div>
            </div>
          );
     }
 }
 export default Profile;
