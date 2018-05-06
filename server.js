// Load HTTP module
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.use(express.static('.'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
   
   socket.on('btnClick', function(){
       console.log("they hit the button to start");
   })

    socket.on('sizeChange', function(data){
        console.log("size got changed to:");
        console.log(data);
    });


});

http.listen(8080, function() {
   console.log('listening on localhost:8080');
});