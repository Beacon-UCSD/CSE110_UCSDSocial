var mysql = require('mysql2');

//function to clean string of symbols
function cleanString(str) {
    return str.replace(/[^a-z0-9@.]+/gi, " ");
}

//function to return javascript date in string format for storing in db
function getMySQLDate(jsDate) {
    return jsDate.getUTCFullYear() + '-' + (jsDate.getUTCMonth()+1) + '-' 
        + jsDate.getUTCDate() + ' ' + jsDate.getUTCHours() + ':' 
        + jsDate.getUTCMinutes() + ':' + jsDate.getUTCSeconds();
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
            // tags, convert array to json string
            stripped = JSON.stringify(eventObjVals[idx]);
        } else if ((idx == 4 || idx == 5) && eventObjVals[idx] instanceof Date) {
            // this is a date object, convert to mysql date.
            stripped = getMySQLDate(eventObjVals[idx]);
        } else {
            stripped = cleanString(eventObjVals[idx].toString());
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

    //function to query for all events
    //returns a promise to the query return obj
    getAllEvents() {

        var allEventsQuery = "SELECT * FROM EventsNewTable;";

        return this.makeQuery( allEventsQuery );

    }

    //function to store a new event to db
    //eventObj holds all the fields for an event
    //returns a promise to the result of the insertion
    createEvent(eventObj) {
        // Add event query
        var query = "INSERT INTO EventsNewTable(Eventname,Tags,Hostname,Hostemail," +
            "Startdate,Enddate,Private,Description,FlyerURL,Attendees,Forum) " +
            "VALUES(" + eventToStr(eventObj) + ");";
        return this.makeQuery(query);
    }

    //function to update an existing event in the database
    //eventObj holds the all the fields for an event
    //returns a promise to the result of the insertion
    updateEvent( eventObj ) {

        if (typeof(eventObj.Tags == 'object')) {
            // tags, convert array to json string
            eventObj.Tags = JSON.stringify(eventObj.Tags);
        }
        if (eventObj.Startdate instanceof Date) {
            // startdate, convert to string
            eventObj.Startdate = getMySQLDate(eventObj.Startdate);;
        }
        if (eventObj.Enddate instanceof Date) {
            // enddate, convert to string
            eventObj.Enddate = getMySQLDate(eventObj.Enddate);;
        }

        // Update event query
        var query = "UPDATE EventsNewTable SET " +
            "Eventname='"+cleanString(eventObj.Eventname.toString())+"'," +
            "Tags='"+eventObj.Tags+"'," +
            "Hostname='"+cleanString(eventObj.Hostname.toString())+"'," +
            "Hostemail='"+cleanString(eventObj.Hostemail.toString())+"'," +
            "Startdate='"+eventObj.Startdate+"'," +
            "Enddate='"+eventObj.Enddate+"'," +
            "Private='"+cleanString(eventObj.Privacy.toString())+"'," +
            "Description='"+cleanString(eventObj.Description.toString())+"'," +
            "FlyerURL='"+cleanString(eventObj.FlyerURL.toString())+"' " +
            "WHERE EventID='"+eventObj.EventID+"' LIMIT 1;";

        return this.makeQuery(query);
    }

    //function to delete event from table
    //eventID is the id for the event to delete
    //returns a promise to the result of the insertion
    deleteEvent( eventID ) {

        var deleteEventQuery = "DELETE FROM EventsNewTable where EventID="+eventID+";";

        return this.makeQuery( deleteEventQuery );

    }



    //function to query for a specific event events
    //eventID : the id of the queried event
    //returns a promise to the query return obj
    getEvent( eventID ) {

        var specificEventQuery = 'SELECT * FROM EventsNewTable where EventID =' + 
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

module.exports = DbController
