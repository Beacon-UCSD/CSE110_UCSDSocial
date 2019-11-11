const express = require('express');
const path = require('path');

const app = express();

const testEventList = [
	{
		tagID: "",
		Eventname: "Event name 1",
		Host: "dan",
		Date: "11/11/11",
		Starttime: "11:11",
		Endtime: "7:30",
		Private: "True",
		Description: "This is a test event",
		FlyerURL: "impath",
		Ateendees: "tien, andrew"
	},
	{
		tagID: "",
		Eventname: "Event name 2",
		Host: "dan",
		Date: "11/11/11",
		Starttime: "11:11",
		Endtime: "7:30",
		Private: "True",
		Description: "This is a test event for event 2",
		FlyerURL: "impath",
		Ateendees: "tien, andrew"
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
