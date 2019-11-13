const express = require('express');
const path = require('path');

const app = express();

const testEventList = [
	{
		EventID: "000",
		tagID: "CSE110, Project",
		Eventname: "CSE110 Project Meeting",
		Host: "Dan Lam",
		Date: "11/11/19",
		Starttime: "10:00 AM",
		Endtime: "11:30 AM",
		Private: "True",
		Description: "We will be working on the data",
		FlyerURL: "",
		Attendees: "tien, andrew, cameron"
	},
	{
		EventID: "001",
		tagID: "Hangout, Lunch, Price Center",
		Eventname: "Team Lunch",
		Host: "Gary",
		Date: "11/12/19",
		Starttime: "1:00 PM",
		Endtime: "2:00 PM",
		Private: "True",
		Description: "Lunch meet-up at price center! Lets just chill and not talk about the project for once!",
		FlyerURL: "",
		Attendees: "tien, andrew, cameron, rujvi, dan"
	},
	{
		EventID: "002",
		tagID: "Hangout, Lunch, Price Center",
		Eventname: "Lonely During Lunch?",
		Host: "Teemo",
		Date: "12/13/19",
		Starttime: "1:05 PM",
		Endtime: "2:05 PM",
		Private: "False",
		Description: "Lunch meet-up at price center! Lets just chill and we have free cookies!",
		FlyerURL: "",
		Attendees: ""
	}
];

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
	//var list = ["Event1", "Event2", "Event3"];
	res.json(testEventList);
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
})

app.all('/api/storeEvent', (req,res) => {
    console.log(req)
});



// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
	//res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
