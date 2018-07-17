var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [];
var users = [];

app.get('/',function(req,res)
{
    res.sendFile(__dirname + '/index.html');

});
app.get('/style.css',function(req,res)
{
    res.sendFile(__dirname + '/style.css');

});
app.get('/script.js',function(req,res)
{
    res.sendFile(__dirname + '/script.js');

});

io.on('connection', function(socket){
    socket.on('user data', function(nick){
        users.push(nick);
        io.emit('user data', nick);
        
    });
    socket.on('newUser',function (username) {
        socket.username = username;
   });
   socket.on('disconnect', function () {
    var connectionMessage = socket.username + " Disconnected from Chat";
     io.emit('disconnected', connectionMessage);
  });
    socket.on('chat message', function(msg){
        messages.push(msg);
        io.emit('chat message', msg);
    });
    
    socket.emit('chat history', messages);
    socket.emit('users history', users);
    socket.on('disconnect', function () {
        socket.emit('user disconnected');
      });
    socket.on('just appeared', function(user){
        setTimeout(function(){
            socket.emit('online', user);
            console.log("online")
                },10000);
        socket.emit('just',user);
    
    });

    socket.on('typing', function(){
        socket.emit('user typing', socket.username); 
    });
});



http.listen(3000, function(){
    console.log('listening on 3000');
});