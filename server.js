/*
server.js
(C) Callum Baird, 2018

A script which runs as the server for the Road Survey Tool
Runs using the node platform
Handles hosting of the HTML page as well as carrying data between the various scripts via Node.js

Libraries used:
Google Maps API, Google 2018 - https://cloud.google.com/maps-platform/maps/
Express (via npm), Node.js Foundation 2018 - https://expressjs.com/
Node.js, Node.js Foundation 2018 - https://nodejs.org/en/
Socket.io (via npm), Socket.io Team 2018 - https://socket.io/

*/

/*
* Initialise required node modules
*/
var express = require('express'); // express to make an app which can see all of the files in the project
var app = express(); // initialise app object
var server = require('http').Server(app); // run server off of the app
var io = require('socket.io')(server); // run socket.io off the server
var scriptCount = 0; // keep track of how many scripts are running (socket clients)

var imageURL = ""; // url for the image being shown - passed between scripts
var size; // size selected by the user - passed between scripts

/*
* Server setup
* Basic server that hosts my webpage as well as the associated scripts and css
*/
app.use(express.static('.')); // static lets the app know to use all of the files in the directory

app.get('/', function (req, res) { // host index.html as the landing page
    res.sendfile(__dirname + '/index.html');
});

server.listen(8080, function() { // run the server on port 8080
   console.log('listening on localhost:8080');
});


/*
* socket.io event handlers
*
* listen for messages broadcast by other socket connectors (the running scripts)
* sends data to the scripts using the emit command
*/
io.on('connect', function(socket) { //when a script is run aka a socket connection, this will run
    scriptCount ++; // increase the count of scripts
    console.log(scriptCount + " script(s) running.")
    size = 1; // set the size of the user selection to default in case they do not want to change it (no message is sent to the server)

    socket.on('disconnect', function () { // if a script terminates, decrease the count
        scriptCount --;
        console.log(scriptCount + " script(s) running.")
    });

    socket.on('sizeChange', function(data){ // when the user changes size of their input area, this message is emitted
        console.log("size got changed to:"); // log in console
        console.log(data);
        size = data; // update size variable
    });

    socket.on('btnClick',function(data){ // when the user clicks the "Find Road Area" button
        io.emit('btnClick', {size: data.size, URL: data.URL}); // forward the data into the processImage.js script
    });

});


