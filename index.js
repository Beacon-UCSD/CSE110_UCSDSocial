const express = require('express');
const app = express();
const jwt = require('express-jwt');
const path = require('path');
const bodyParser = require('body-parser');

// Gets an instance of the database controller.
// Enlil: File not committed yet since still working on it.
// const dbController = require('./DatabaseController');
// Gets an instance of the user authenticator.
const authenticator = require('./UserAuthenticator');

const testProfileList = [
     {
         UserID: "0",
         GoogleUID: "00",
         Username: "User1",
         Password: "wordpass",
         Email: "user1@ucsd.edu",
         Phone: "(555) 123-4567",
         tagIDs: "CSE110, Geisel",
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
/*
 * FOR TESTING PURPOSES ONLY!
 * TODO REMOVE IN FUTURE
 */
const testEventList = [
	{
		EventID: "0",
		tagID: "CSE110, Project",
		Eventname: "CSE110 Project Meeting",
		Host: "Dan Lam",
		Startdate: (new Date(2019,0,12)).toString(),
		Enddate: (new Date(2019,0,12,12)).toString(),
		Private: true,
		Description: "We will be working on the data",
		FlyerURL: "",
		Attendees: "tien, andrew, cameron"
	},
	{
		EventID: "1",
		tagID: "Hangout, Lunch, Price Center",
		Eventname: "Team Lunch",
		Host: "Gary",
		Startdate: (new Date(2019,1,12)).toString(),
		Enddate: (new Date(2019,1,12,12)).toString(),
		Private: true,
		Description: "Lunch meet-up at price center! Lets just chill and not talk about the project for once!",
		FlyerURL: "",
		Attendees: "tien, andrew, cameron, rujvi, dan"
	},
	{
		EventID: "2",
		tagID: "Hangout, Lunch, Price Center",
		Eventname: "Lonely During Lunch?",
		Host: "Teemo",
		Startdate: (new Date(2019,0,13,3)).toString(),
		Enddate: (new Date(2019,0,14,12)).toString(),
		Private: false,
		Description: "Lunch meet-up at price center! Lets just chill and we have free cookies!",
		FlyerURL: "",
		Attendees: ""
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

// Make every path below this point protected.
app.use(jwt({secret: authenticator.JWT_SECRET}));

///////////////////////////////////////////////////////////////////////////////
///////////////// INSERT ALL PROTECTED PATHS BELOW THIS LINE //////////////////
///////////////////////////////////////////////////////////////////////////////

// Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
	//var list = ["Event1", "Event2", "Event3"];
	res.json(testEventList);
	console.log('Sent list of items');
});

app.get('/api/getUsers', (req,res) => {
	res.json(testProfileList);
	console.log('Sent list of items');
});

app.get('/api/getEvent', (req,res) => {
	var eventid = req.query.EventID;
	console.log('Attempt: Sent event ' + eventid);
	var event = testEventList.filter(e => {
		return e.EventID === eventid;
	});
	console.log('Result: ' + event[0].Eventname);
	res.json(event[0]);
});

app.post('/api/storeEvent', function (req,res) {
	console.log('Body of Request for storing: ');
	console.log(req.body);
	console.log('Attempt: Store new event: ' + req.body.Eventname);
	var newEvent = {
		EventID: testEventList.length.toString(10),
		tagID: req.body.tagID,
		Eventname: req.body.Eventname,
		Host: req.body.Host,
		Startdate: req.body.Startdate,
		Enddate: req.body.Enddate,
		Private: req.body.Private,
		Description: req.body.Description,
		FlyerURL: req.FlyerURL,
		Attendees: req.body.Attendees
	}
	testEventList.push(newEvent);
	console.log('Number of events now: ' + testEventList.length);
	console.log(testEventList);
});



// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
	//res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
