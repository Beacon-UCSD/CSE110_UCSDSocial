var mysql = require('mysql2');

//function to escape quotations from string
function escapeQuotations(str) {
    return str.replace(/"/g, '\\"').replace(/'/g, "\\'");
}

// function to clean string of symbols
function cleanString(str) {
    return str.toString().replace(/[^a-z0-9@.]+/gi, " ");
}

//function to concatenate event object values to string for db query
function eventToStr( eventObj ) {

    //put event keys into array for ordered iterating

    valsStr      = ""
    eventObjVals = [ eventObj.Eventname,
                     eventObj.Tags,
                     eventObj.Host,
                     eventObj.Hostemail,
                     eventObj.Startdate,
                     eventObj.Enddate,
                     eventObj.Private,
                     eventObj.Description,
                     eventObj.FlyerURL,
                     eventObj.Attendees,
                     eventObj.Forum
                   ]

    //concatenate event detail for aggregated query str

    for ( var idx = 0; idx < eventObjVals.length; idx++ ) {

        if ( typeof(eventObjVals[idx] ) == "undefined" ) eventObjVals[idx] = ""

        if (idx == 1 && typeof(eventObjVals[idx] == 'object')) {
            stripped = JSON.stringify(eventObjVals[idx]);
        } else if ((idx == 4 || idx == 5) && eventObjVals[idx] instanceof Date) {
            // this is a date object, convert to mysql date.
            var date = eventObjVals[idx];
            stripped = date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-'
                + date.getUTCDate() + ' ' + date.getUTCHours() + ':'
                + date.getUTCMinutes() + ':' + date.getUTCSeconds();
        } else if(idx == 8) {
            stripped = eventObjVals[idx].toString();
        } else {
            stripped = cleanString(eventObjVals[idx]);
        }

        valsStr += (idx==0 ? "" : ", ") + "\'" + stripped +"\'" ;

    }

    return valsStr;
}


//class for the databse interface

class DbController {


    //constructor for the db controller
    //creates connection to the db
    constructor() {

        //db name

        this.db = "UCSDSocial";

        //connect to the db

        var connection = mysql.createConnection({
            host     : "beacon.cx82s6pkrof3.us-east-1.rds.amazonaws.com",
            user     : "root",
            password : "Beacon110",
            port     : "3306",
            timezone : "UTC"
        });

        connection.connect(function(err) {

            if(err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }

            console.log('Connected to db as id ' + connection.threadId);

        });

        //use proper db

        connection.query( "USE " + this.db + ";" );

        //not sure why but storing in obj up there messes up async so did here
        this.connection = connection;

    }

    //function to query for user id from google account id
    getUserIDByGoogleUID(googleUID) {
        // escape quotations
        googleUID = escapeQuotations(googleUID);

        var getUserIDQuery = "SELECT UserID FROM Users WHERE GoogleUID='" +
            googleUID + "' LIMIT 1;";

        return this.makeQuery(getUserIDQuery);
    }

    //function go get user from userid
    getUserByUserID(userID) {
        // Make sure userID is an integer.
        if (isNaN(userID)) {
            return;
        }

        var getUserQuery = "SELECT UserID,Username,Email,ProfileImage,Phone,Tags," +
            "College,Major,Year,Friends,Hostevents,Notification " +
            "FROM Users WHERE UserID='"+userID+"' LIMIT 1;";

        return this.makeQuery(getUserQuery);
    }

    //function to create new user
    createUser(googleUID, userName, userEmail, userPicture) {
        var insertUserQuery = "INSERT INTO Users (GoogleUID,Username,Email,ProfileImage) VALUES('" +
            cleanString(googleUID)+"','"+cleanString(userName)+"','"+
            escapeQuotations(userEmail.toString())+"','"+
            escapeQuotations(userPicture.toString())+"');"
        return this.makeQuery(insertUserQuery);
    }

    //function to update user information
    updateUserProfile(userId, userObj) {
        try {
            var updateUserQuery = "UPDATE Users SET " +
                "Username='"+cleanString(userObj.Name)+"',"+
                "ProfileImage='"+escapeQuotations(userObj.ProfileImage.toString())+"',"+
                "Phone='"+escapeQuotations(userObj.Phone.toString())+"',"+
                "Tags='"+JSON.stringify(userObj.Tags)+"',"+
                "College='"+cleanString(userObj.College)+"',"+
                "Major='"+cleanString(userObj.Major)+"',"+
                "Year='"+cleanString(userObj.Year)+"' "+
                "WHERE UserID='"+userId+"' LIMIT 1;";
            return this.makeQuery(updateUserQuery);
        } catch(e) {
            console.error("Failed to send UPDATE user sql query.");
            return null;
        }
    }

    //function to query for all events
    //returns a promise to the query return obj
    getAllEvents() {

        var allEventsQuery = "SELECT * FROM Events;";

        return this.makeQuery( allEventsQuery );

    }

    //function to store a new event to db
    //currently overwrites any existing data so for update use this too
    //eventObj holds the all the fields for an event
    //returns a promise to the result of the insertion
    storeEvent( eventObj ) {

        //get the max event id first
        var maxIDQuery = "SELECT MAX(EventID) FROM Events;"
        var tmp = this

        return this.makeQuery( maxIDQuery ).then(function( maxID ) {

            var maxID = Number(maxID[0]['MAX(EventID)'])
            var newID = ('000'+(Number(maxID) + 1)).substr(-3)
            var storeEventQuery = "REPLACE INTO Events(EventID,Eventname,Tags,"+
                "Hostname,Hostemail,Startdate,Enddate,Private,Description,"+
                "FlyerURL,Attendees,Forum) VALUES('"+newID+"',"+
                eventToStr( eventObj )+");";

            return tmp.makeQuery( storeEventQuery );
        })

    }


    //fucntion to update the designated event
    //eventObj holds the all the fields for an event
    //returns a promise to the result of the insertion / update
    updateEvent ( eventObj ){

        var getIDQuery = "SELECT EventID FROM Events where Eventname = '" +
                         eventObj.Eventname.toString() + "' AND Hostname = '" +
                         eventObj.Host.toString() + "';";
        var tmp = this;
        /*
         + " AND Hostname = " + eventObj.Host.toString()
                            + " AND Hostemail = " + eventObj.Hostemail.toString()
                            */

        return this.makeQuery( getIDQuery ).then(function( getID ){
            var getID = Number(getID[0]['EventID'])
            var ID = ('000'+(Number(getID) + 0)).substr(-3)
            console.log("the EventID you trying to update is: " + ID);
            //then need to do the update
            //REPLACE works exactly like INSERT,
            //except that if an old row in the table has the same value as a new row for a PRIMARY KEY
            //the old row is deleted before the new row is inserted.
            var updateEventQuery = "REPLACE INTO Events(EventID,Eventname,Tags,"+
                "Hostname,Hostemail,Startdate,Enddate,Private,Description,"+
                "FlyerURL,Attendees,Forum) VALUES('"+ID+"',"+
                eventToStr( eventObj )+");";

            return tmp.makeQuery(updateEventQuery);
        })

    }

    //Function to update the attendees of an event
    //Where eventID is the string id for an event ("001")
    //Where attendee is the object holding username and userID
    addEventAttendee(eventID, Attendee, callback){

        var attendeeQuery = "SELECT Attendees FROM Events WHERE EventID='" + eventID + "';";
        attendeeQuery = this.makeQuery(attendeeQuery);
        attendeeQuery.then((res) => {
            if (res.length <= 0) {
                callback(null);
                return;
            }

            var AttendieList;
            if (res[0].Attendees == "") {
                AttendieList = [];
            } else {
                AttendieList = JSON.parse(res[0].Attendees);
            }

            AttendieList.push(Attendee);
            AttendieList = JSON.stringify(AttendieList);

            var updateQuery = "UPDATE Events SET " +
                "Attendees='"+AttendieList+"' "+
                "WHERE EventID='"+eventID+"' LIMIT 1;";
            callback(this.makeQuery(updateQuery));
        });
    }

    //Function to update the attendees of an event
    //Where eventID is the string id for an event ("001")
    //Where attendee is the object holding username and userID
    leaveEventAttendee(eventID, Attendee, callback){
        var attendeeQuery = "SELECT Attendees FROM Events WHERE EventID='" + eventID + "';";
        attendeeQuery = this.makeQuery(attendeeQuery);
        attendeeQuery.then((res) => {
            if (res.length <= 0) {
                callback(null);
                return;
            }

            var AttendieList;
            if (res[0].Attendees == "") {
                AttendeeList = [];
            } else {
                AttendieList = JSON.parse(res[0].Attendees);

                //Removes the Attendee
                var found = false;
                for (var i = 0; i < AttendieList.length; i++) {
                    if (AttendieList[i].userID == Attendee.userID) {
                        AttendieList.splice(i, 1);
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    callback(null);
                    return;
                }
            }

            AttendieList = JSON.stringify(AttendieList);

            var updateQuery = "UPDATE Events SET " +
                "Attendees='"+AttendieList+"' "+
                "WHERE EventID='"+eventID+"' LIMIT 1;";
            callback(this.makeQuery(updateQuery));
        });
    }

    //function to delete event from table
    //eventID is the id for the event to delete
    //returns a promise to the result of the insertion
    deleteEvent( eventID ) {

        var deleteEventQuery = "DELETE FROM Events where EventID="+eventID+";";

        return this.makeQuery( deleteEventQuery );

    }



    //function to query for a specific event events
    //eventID : the id of the queried event
    //returns a promise to the query return obj
    getEvent( eventID ) {

        var specificEventQuery = 'SELECT * FROM Events where EventID =' +
                                                                eventID + ' ;';

        return this.makeQuery( specificEventQuery );

    }


    //helper method to make a query since repetitive code
    //returns promise to the query obj
    makeQuery( query ) {

        //need to store these here since promise doesn't have scope of this

        var connection = this.connection;
        var db = this.db;

        //create promise and perform query

        return new Promise(function(resolve, reject) {

            connection.query( query , db, function (error, results, fields) {

                if ( error != null )
                    console.log( error );

                resolve( results )

            });

        });

    }

    //function to close the connection for this obj
    closeConnection () {
        try {

            this.connection.end()
            console.log("closed connection to db")

        }
        catch (err) {

            console.log("caught error in trying to close db connection" + err);

        }
    }

}

module.exports = new DbController();
