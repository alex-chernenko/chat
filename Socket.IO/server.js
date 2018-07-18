var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [];
var users = [];
var nicks = ["nickname"];

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
        var place = users.length;
        
        io.emit('user data', users);
        
        setTimeout(function(){
            nick.status = "online";
            users.splice(place,1);
         
            
            io.emit('user data', users);
                }, 60000);
     
    });
    socket.on('validation', function (Nick)
{   var nope = false;
    for (i in nicks)
    {   
        if (nicks[i] == Nick)
        {socket.emit('val-', "This Nickname already exist");
            
        nope = true;
        break;}}
        if (nope == false) {
        if (Nick.length < 5)
        {socket.emit('val-', "Too short, Must be 5 symbols or more"); }
        else if (Nick.length > 12)
        {socket.emit('val-', "Too long, Must be 12 symbols or less"); }
        else {
            {socket.emit('val+', "It`s Ok Welcome!");
        nicks.push(Nick) }
        
        }
    }
        

});
    socket.on('newUser',function (user) {
        socket.username = user.name;
        socket.usernick = user.nickname;
        socket.emit('chat history', messages);
        
   });
   socket.on('disconnect', function () {
    var connectionMessage = socket.usernick + " Disconnected from Chat";
     io.emit('disconnected', connectionMessage);
     for (var user in users)
     {
         if (users[user].nickname == socket.usernick)

         { 
              var place = users.indexOf(users[user]);
            var updatedUser = users[user];
            updatedUser.status = "just left"
            users.splice(place,1,updatedUser);
            io.emit('user data2', users);
            setTimeout(function(){
                updatedUser.status = "offline";
                
                users.splice(place,1,updatedUser);
                io.emit('user data2', users);
                    }, 60000);
         }
     }
     
     
  });
    socket.on('chat message', function(msg){
        messages.push(msg);
        io.emit('chat message', msg);
    });
    
    
   
    socket.on('disconnect', function () {
        socket.emit('user disconnected');
      });
      socket.on('typing', function (data) {
        console.log(data);
        socket.broadcast.emit('typing', data);
      });

      
});



http.listen(3000, function(){
    console.log('listening on 3000');
});