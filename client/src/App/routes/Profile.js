import React, {Component} from "react";
import auth from '../auth';
import pfetch from '../fetch.protected';
import './Profile.css'
import { Link } from 'react-router-dom';

class Profile extends Component {

     constructor(props) {
         super(props);

         this.state = {
             name:      "",
             picture:   "",
             email:     "",
             phone:     "",
             tags:      [],
             college:   "",
             major:     "",
             year:      "",
             friends:   "",
             events:    [],
             notifications: []
         };

         var gettingAnotherUsersProfile = true;
         var params = "";

         // Check if getting current user's profile
         var userInfo = auth.getUserInfo();
         if (!("UserID" in this.props.match.params) ||
               this.props.match.params.UserID == userInfo.id) {
             gettingAnotherUsersProfile = false;

             // Temporarily load  basic user info (name, email, and profile pic)
             // These data will be overwritten once backend responds to api call.
             this.state.name = userInfo.name;
             this.state.picture = userInfo.pictureSrc;
             this.state.email = userInfo.email;
         } else {
             params += "?UserID=" + this.props.match.params.UserID;
         }

         this.ownProfile = !gettingAnotherUsersProfile;

         // Get profile from backend.
         pfetch.jsonGet('/api/getProfile'+params, (user) => {
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
                 picture:   user.Picture,
                 email:     user.Email,
                 phone:     user.Phone,
                 tags:      user.Tags,
                 college:   user.College,
                 major:     user.Major,
                 year:      user.Year,
                 friends:   user.Friends,
                 events:    user.Events
             });
             if (!gettingAnotherUsersProfile) {
                this.setState({
                    notifications: user.Notifications
                });
             }
         });
         
         this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
     }

     handleUpdateProfile(evt){
         let profileData = {
             userId: this.state.UserID,
             picture: this.state.picture,
             name: this.state.name,
             phone: this.state.phone,
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
                <img className="profile-img" src={this.state.picture}/>
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
                  {this.ownProfile &&
                      <button onClick={this.handleUpdateProfile}>Update Profile</button>
                  }
                </div>
              </div>
            </div>
          );
     }
 }
 export default Profile;
