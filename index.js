const express = require('express');
const app = express();
const jwt = require('express-jwt');
const path = require('path');
const bodyParser = require('body-parser');

//get our db instance
const db = require( './databaseController.js')

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

// endpoint to get logged in users profile
app.get('/api/getProfile', (req,res) => {
    // Get the id of the user
    var userID;
    if ("UserID" in req.query && !isNaN(req.query.UserID)) {
        userID = parseInt(req.query.UserID);
        if (userID < 0) {
            res.status(400);
        }
    } else {
        userID = req.user.sub;
    }

    console.log("Get profile: " + userID);

    var userQuery = db.getUserByUserID(userID);
    userQuery.then((queryRes) => {
        if (queryRes.length <= 0) {
            res.status(401);
            return;
        }
        try {
            var user;
            if (req.user.sub == userID) {
                // The user is requesting his/her own profile
                // Send everything
                user = {
                    UserID: queryRes[0].UserID,
                    Name: queryRes[0].Username,
                    Email: queryRes[0].Email,
                    Picture: queryRes[0].ProfileImage,
                    Phone: queryRes[0].Phone,
                    Tags: queryRes[0].Tags,
                    College: queryRes[0].College,
                    Major: queryRes[0].Major,
                    Year: queryRes[0].Year,
                    Friends: queryRes[0].Friends,
                    Events: queryRes[0].Hostevents,
                    Notifications: queryRes[0].Notification
                };
            } else {
                // The user is requesting someone else's profile
                // Send only public info
                user = {
                    UserID: queryRes[0].UserID,
                    Name: queryRes[0].Username,
                    Email: queryRes[0].Email,
                    Picture: queryRes[0].ProfileImage,
                    Phone: queryRes[0].Phone,
                    Tags: queryRes[0].Tags,
                    College: queryRes[0].College,
                    Major: queryRes[0].Major,
                    Year: queryRes[0].Year,
                    Friends: queryRes[0].Friends,
                    Events: queryRes[0].Hostevents
                };
            }
            res.status(200).json(user);
        } catch (e) {
            console.error("Error getting user profile.");
            console.error(e);
            res.status(500);
        }
    });
});

app.post('/api/updateMyProfile', (req,res) => {
    var userQuery = db.getUserByUserID(req.user.sub);
    userQuery.then((queryRes) => {
        if (queryRes.length <= 0) {
            // This user id does not exist.
            res.status(401);
            return;
        }
        try {
            // Get user id.
            var userID = queryRes[0].UserID;
            // Get all parameters sent with the http request.
            // For all missing parameters, use the existing value in db.
            var userObj = {
                Name: ("Name" in req.body) ? req.body.Name : queryRes[0].Username,
                ProfileImage: ("Picture" in req.body) ? req.body.Picture : queryRes[0].ProfileImage,
                Phone: ("Phone" in req.body) ? req.body.Phone : queryRes[0].Phone,
                Tags: ("Tags" in req.body) ? req.body.Tags : queryRes[0].Tags,
                College: ("College" in req.body) ? req.body.College : queryRes[0].College,
                Major: ("Major" in req.body) ? req.body.Major : queryRes[0].Major,
                Year: ("Year" in req.body) ? req.body.Year : queryRes[0].Year
            };

            var updateUserQuery = db.updateUserProfile(userID, userObj);
            updateUserQuery.then((createRes) => {
                console.log(createRes);
                res.status(200).json({success:true});
            });
        } catch(e) {
            console.error("Error getting user profile [2].");
            console.error(e);
            res.status(500);
        }
    });
});

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

    singleEventQuery = db.getEvent( req.query.EventID );

    singleEventQuery.then(function( singleEvent ){
        res.json(singleEvent[0]);
        console.log('Sent event');
    });
});

//endpoint to delete an event
app.post('/api/deleteEvent', (req,res) => {

    deleteEventQuery = db.deleteEvent( req.body.EventID )

    deleteEventQuery.then(function( deleteEventResponse ){

        console.log( 'Deleted event ' );

    })

});

app.post('/api/storeEvent', function (req,res) {

	var eventObj = {
		Tags: req.body.Tags,
		Eventname: req.body.Eventname,
        	Host: req.user.name,
        	Hostemail: req.user.email,
		Startdate: new Date(req.body.Startdate),
		Enddate: new Date(req.body.Enddate),
		Private: req.body.Private,
		Description: req.body.Description,
		FlyerURL: req.body.FlyerURL,
		Attendees: req.body.Attendees
	};

    // TODO validate everything before adding to db

    storeEventQuery = db.storeEvent( eventObj );

    storeEventQuery.then(function( storeEventResponse ){

        console.log( 'Store event response: ' + storeEventResponse );
        res.json({success:true});

    });

});

app.post('/api/updateEvent', function (req,res) {
    var eventID = req.body.EventID;
    var eventQuery = db.getEvent(eventID);
    eventQuery.then((queryRes) => {
        if (queryRes.length <= 0) {
            // This event id does not exist.
            res.status(404);
            return;
        }
        try {
            // Get all parameters sent with the http request.
            // For all missing parameters, use the existing value in db.
            var eventObj = {
                Description: ("Description" in req.body) ? req.body.Description : queryRes[0].Description,
                Private: ("Private" in req.body) ? req.body.Private : queryRes[0].Private,
                Startdate: ("Startdate" in req.body) ? new Date(req.body.Startdate) : queryRes[0].Startdate,
                Enddate: ("Enddate" in req.body) ? new Date(req.body.Enddate) : queryRes[0].Enddate,
                FlyerURL: ("FlyerURL" in req.body) ? req.body.FlyerURL : queryRes[0].FlyerURL
            };
            console.log(eventObj.Startdate);
            console.log(typeof(eventObj.Startdate));

            var updateEventQuery = db.updateEvent(eventID, req.user.email, eventObj);
            updateEventQuery.then((updateRes) => {
                console.log(updateRes);
                res.status(200).json({success:true});
            });
        } catch(e) {
            console.error("Error getting event details [2].");
            console.error(e);
            res.status(500);
        }
    });
});

app.post('/api/joinEvent', function (req,res){
    var eventID = req.body.EventID;
    var Attendee = {
        userID: req.user.sub,
        userName: req.user.name
    };

    db.addEventAttendee(eventID, Attendee, (joinEventQuery) => {
        if (joinEventQuery == null) {
            console.error("Error occured with joining event.");
            res.status(500);
            return;
        }
        console.log("Done add User: " + req.user.sub + " | event: " + eventID);

        joinEventQuery.then(function( joinEventResponse ){

            console.log( 'Join event response: ' + joinEventResponse );
            res.json({success:true});
        });
    });
});

app.post('/api/leaveEvent', function (req,res){
    var eventID = req.body.EventID;
    var Attendee = {
        userID: req.user.sub,
        userName: req.user.name
    };

    db.leaveEventAttendee(eventID, Attendee, (leaveEventQuery) => {
        if (leaveEventQuery == null) {
            console.error("Error occured with leaving event.");
            res.status(500);
            return;
        }
        console.log("Done remove User: " + req.user.sub + " | event: " + eventID);

        leaveEventQuery.then(function( leaveEventResponse ){

            console.log( 'Leave event response: ' + leaveEventResponse );
            res.json({success:true});
        });
    });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
