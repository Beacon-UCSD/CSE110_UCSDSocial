var mysql = require('mysql');                                                    

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
        } else {
            stripped = eventObjVals[idx].toString().replace(/[^a-z0-9@.]+/gi, " ");
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
            port     : "3306"                                                            
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

module.exports = DbController
