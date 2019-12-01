const express = require('express');
const app = express();
const jwt = require('express-jwt');
const path = require('path');
const bodyParser = require('body-parser');

const DbController = require( './databaseController.js')

//create our db instance
const db = new DbController();

// Gets an instance of the database controller.
// Enlil: File not committed yet since still working on it.
// const dbController = require('./DatabaseController');
// Gets an instance of the user authenticator.
const authenticator = require('./UserAuthenticator');

var FileReader = require('filereader');


const testProfileList = [
    {
        UserID: "0",
        GoogleUID: "00",
        Username: "User1",
        Password: "wordpass",
        Email: "user1@ucsd.edu",
        Phone: "(555) 123-4567",
        tagIDs: ["CSE110", "Geisel"],
        College: "Marshall",
        Major: "History",
        Year: "Senior",
        Friends: "Gary, Rick, Pradeep",
        Hostevents: "Library Study Session",
        Notifications: "CSE110 events"
    }
];
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Parse application/x-www-form-urlencoded
// Not sure if required so left commented. If you have issues receiving form
// values after sending to backend, uncomment line below and see if they work.
//app.use(bodyParser.urlencoded({extended:false}));

// Parse application/json
app.use(bodyParser.json());

app.post('/api/authentication/validateGoogleUser', (req, res) => {
    // Check if id_token is sent.
    if (req == null || req.body == null || req.body.id_token == null) {
        // send bad request error
        res.status(400).json({success:false,message:"Missing required params."});
        return;
    }

    // Do magic and send client a session token
    authenticator.authenticate(req.body.id_token, res);
});

// Login tester 1 -- remove in production
app.post('/api/authentication/validateTester1', (req, res) => {
    authenticator.authenticateTester1(res);
});

// Login tester 2 -- remove in production
app.post('/api/authentication/validateTester2', (req, res) => {
    authenticator.authenticateTester2(res);
});

// Make every path below this point protected.
app.use(jwt({secret: authenticator.JWT_SECRET}));

///////////////////////////////////////////////////////////////////////////////
///////////////// INSERT ALL PROTECTED PATHS BELOW THIS LINE //////////////////
///////////////////////////////////////////////////////////////////////////////

// Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {

    allEventsQuery = db.getAllEvents()

    allEventsQuery.then(function( allEvents ){

        res.json( allEvents );
        console.log('Sent list of items');

    })

});

app.get('/api/getUsers', (req,res) => {
	res.json(testProfileList[0]);
	console.log('Sent list of items');
});

///endpoint to get an event
app.get('/api/getEvent', (req,res) => {

    singleEventQuery = db.getEvent( req.query.EventID )

    singleEventQuery.then(function( singleEvent ){

        res.json( singleEvent[0] );

        console.log( 'Sent event ' );

    })

});

//endpoint to delete an event
app.get('/api/deleteEvent', (req,res) => {

    deleteEventQuery = db.deleteEvent( req.query.EventID )

    deleteEventQuery.then(function( deleteEventResponse ){

        console.log( 'Deleted event ' );

    })

});

app.post('/api/storeEvent', function (req,res) {

	var eventObj = {
		Tags: req.body.Tags,
		Eventname: req.body.Eventname,
		Host: req.body.Host,
		Startdate: req.body.Startdate,
		Enddate: req.body.Enddate,
		Private: req.body.Private,
		Description: req.body.Description,
		FlyerURL: req.body.FlyerURL,
		Attendees: req.body.Attendees
	}

    console.log(eventObj.FlyerURL);

    storeEventQuery = db.storeEvent( eventObj )

    storeEventQuery.then(function( storeEventResponse ){

        console.log( 'Store event response: ' + storeEventResponse );

    })

});

app.post('/api/updateEvent', function (req,res) {

    var eventObj = {
        Tags: req.body.Tags,
        Eventname: req.body.Eventname,
        Host: req.body.Host,
        Startdate: req.body.Startdate,
        Enddate: req.body.Enddate,
        Private: req.body.Private,
        Description: req.body.Description,
        FlyerURL: req.body.FlyerURL,
        Attendees: req.body.Attendees
    }

    console.log(eventObj.FlyerURL);
    
    updateEventQuery = db.updateEvent( eventObj )
    updateEventQuery.then(function( updateEventResponse ){

        console.log( 'Store event response: ' + updateEventResponse );

    })

});


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
