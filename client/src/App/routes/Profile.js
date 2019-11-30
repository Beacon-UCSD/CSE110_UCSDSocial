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

              <div id="main" className="background-profile">
                <img className="profile" src={this.userInfo.pictureSrc}/>
                <h2 className="title">{this.userInfo.name}</h2>
                <div className="info">
                  <h6 className="actuaInfo">Email:<h7>{this.userInfo.email}</h7></h6>
                  <h6 className="actuaInfo">Phone Number:<h7>{this.state.event.Phone}</h7></h6>
                  <h6 className="actuaInfo">Tag IDs:<h7>{this.state.event.tagIDs}</h7></h6>
                  <h6 className="actuaInfo">College:<h7>{this.state.event.College}</h7></h6>
                  <h6 className="actuaInfo">Major:<h7>{this.state.event.Major}</h7></h6>
                  <h6 className="actuaInfo">Year:<h7>{this.state.event.Year}</h7></h6>
                  <h6 className="actuaInfo">Friends:<h7>{this.state.event.Friends}</h7></h6>
                  <h6 className="actuaInfo">Host Events:<h7>{this.state.event.Hostevents}</h7></h6>
                  <h6 className="actuaInfo">Notifications:<h7>{this.state.event.Notifications}</h7></h6>
                </div>
              </div>
            </div>
          );
     }
 }
 export default Profile;
