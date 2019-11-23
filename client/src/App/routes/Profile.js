import React, {Component} from "react";
import auth from '../auth';
import pfetch from '../fetch.protected';

class Profile extends Component {

     constructor(props) {
         super(props);

         // Gets basic user info (name, email, and profile pic)
         this.userInfo = auth.getUserInfo();

         this.state = {
             list: []
         }
     }

     componentDidMount() {
         pfetch.jsonGet('/api/getUsers', (list) => {
             this.setState({list});
         });
     }

     render() {
         const {list} = this.state;
         return (
             <div>
                 {list.map((item) => {
                     return (
                         <div key={item.UserID}>
                             <img src={this.userInfo.pictureSrc} alt={"You, "+this.userInfo.name} height={"100"} width={"100"} />
                             <h1>{this.userInfo.name}</h1>
                             <h3>Email:</h3>
                             <p>{this.userInfo.email}</p>
                             <h3>Phone Number:</h3>
                             <p>{item.Phone}</p>
                             <h3>Tag IDs:</h3>
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
