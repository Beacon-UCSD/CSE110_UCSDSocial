var sql = require('./database.js');


var event = function(event){
    this.event = event.event;
    this.status = event.status;
    this.created_at = new Date();
};

// i would assume this new Event is um a json file?
event.createEvent = function (newEvent, result) {    
    sql.query("INSERT INTO Events VALUES ?", newEvent, function (err, res) {           
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};


event.getEventById = function (eventId, result) {
    sql.query("SELECT * FROM Events where EventID = ? ", eventId, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

event.getAllEvent = function (result) {
    sql.query("Select * from Events", function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            console.log('tasks : ', res);  
            result(null, res);
        }
    });   
};

//toChange might looks like this ['Date', 'XXXX-XX-XX', 'Description', 'bluhbluhbluh']
event.updateById = function(id, event, toChange, result){
	var str = "UPDATE Events SET event " // = ? WHERE id = ?", [task.task, id]
	for (var i=0; i <toChange.length; i = i+2){
		str = str +" "+ toChange[i] + "= '" + toChange[i+1]+"', ";
	}

  	sql.query(str + "WHERE id = ?", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{   
            result(null, res);
        }
    }); 
};

event.removeEvent = function(event, result){
     sql.query("DELETE FROM Events WHERE EventId = ?", [event.eventId], function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{       
            result(null, res);
        }
    }); 
};

event.removeById = function(eventId, result){
     sql.query("DELETE FROM Events WHERE EventId = ?", [eventId], function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{       
            result(null, res);
        }
    }); 
};

module.exports= event;