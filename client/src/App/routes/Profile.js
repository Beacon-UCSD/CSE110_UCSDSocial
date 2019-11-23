import React, {Component} from "react";
 import {Route} from 'react-router-dom';

 class Profile extends Component {

     constructor(props) {
         super(props);
         this.state = {
             list: []
         }
     }

     componentDidMount() {
         fetch('/api/getUsers')
         .then(res => res.json())
         .then(list => this.setState({list}))
     }

     render() {
         const {list} = this.state;
         return (
             <div>
                 {list.map((item) => {
                     return (
                         <div>
                             <h1>{item.Username}</h1>
                             <h3>Email:</h3>
                             <p>{item.Email}</p>
                             <h3>Phone Number:</h3>
                             <p>{item.Phone}</p>
                             <h3>Tage IDs:</h3>
                             <p>{item.tagIDs}</p>
                             <h3>College:</h3>
                             <p>{item.College}</p>
                             <h3>Major:</h3>
                             <p>{item.Major}</p>
                             <h3>Year:</h3>
                             <p>{item.Year}</p>
                             <h3>Friends:</h3>
                             <p>{item.Friends}</p>
                             <h3>Host Events:</h3>
                             <p>{item.Hostevents}</p>
                             <h3>Notifications:</h3>
                             <p>{item.Notifications}</p>
                         </div>
                     );
                 })}
             </div>
         );
     }
 }
 export default Profile;
