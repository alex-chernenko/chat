$(document).ready(function(){

    var nameInput = document.getElementById('userName');
    var nickInput = document.getElementById('userNick');
    var messages = document.getElementById('messages');
    var text = document.getElementById('text');
    var socket = io.connect();
    
   
    $("#enter").click(function(){
        $(".chat").css("visibility","visible");
        $("#authorization").css("visibility","hidden");
        userName = nameInput.value || "User Name";
        userNick = nickInput.value || "User Nick";
        
        var user = {
            name: userName,
            nickname: userNick,
            status: "offline"
        };
        
        socket.emit("newUser", userNick);
       socket.emit('user data', user);
       
       
    });
    $("#submit").click(function(){
        
        var data = {
            name: userName,
            text: text.value
        };
        
        text.value = '';
       
        socket.emit('chat message', data);
    });

socket.on('chat history',function(msg){
   
            messages.innerHTML = "";
        for (var i in msg) {
            if (msg.hasOwnProperty(i)) {
                var el = document.createElement('li');
                el.innerText = msg[i].name + ": " +msg[i].text;
                messages.appendChild(el);
                if ((msg[i].text).indexOf("@"+userNick) !== -1)
                {
                    console.log(el);
                    el.style.background = "pink";
                }
                if (messages.childElementCount > 100)
                {
                    messages.removeChild(messages.firstChild);
                }
                
             }
             
        }
});
socket.on('users history',function(msg){
   console.log(msg);
    users.innerHTML = "";
for (var i in msg) {
    if (msg.hasOwnProperty(i)) {
        var el = document.createElement('li');
        var el2 = document.createElement('li');
        var el3 = document.createElement('li');
        el.innerText = msg[i].name ;
        el2.innerText = "(@" +msg[i].nickname + ")";
        el3.innerText = msg[i].status;
        users.appendChild(el);
        el.appendChild(el2);
        el2.appendChild(el3);
            }
     
}
});

socket.on('user data', function(user){
    var el = document.createElement('li');
    var el2 = document.createElement('li');
    var el3 = document.createElement('li');
    el.innerText = user.name;
    el2.innerText = "(@" +user.nickname + ")";
    el3.innerText = "just appeared";
    users.appendChild(el);
    el.appendChild(el2);
    el2.appendChild(el3);
    socket.emit('just appeared', user);
});
socket.on('just', function(user){
   for (var i=1; i<= users.childElementCount; i++)
   {    
       elem=users.childNodes[i-1]
       
    //    console.log(elem.childNodes[1].innerHTML);
    //     console.log("(@"+user.nickname+")");
       if ((elem.childNodes[1].innerHTML) == ("(@"+user.nickname+")"))
       {         var el3 = document.createElement('li');
       el3.innerText = "just appeared";
             (elem.childNodes[1]).appendChild(el3);
       }
   }
})
socket.on('online', function(user){
    for (var i=1; i<= users.childElementCount; i++)
    {    
        elem=users.childNodes[i-1]
        
        console.log((elem.childNodes[1].innerText));
         console.log("(@"+user.nickname+")");
        if (((elem.childNodes[1].innerHTML).indexOf("(@"+user.nickname+")") !== -1))
        {         
             ((elem.childNodes[1]).childNodes[1]).innerHTML = "online"
        }
    }
 })


socket.on('chat message', function(msg){
    var el = document.createElement('li');
    el.innerText = msg.name + ": " +msg.text;
    messages.appendChild(el);
    if (messages.childElementCount > 100)
    {
        messages.removeChild(messages.firstChild);
    }
});





socket.on('disconnected', function(connectionMessage){
    console.log('user disc');
    var el = document.createElement('li');
    el.innerText = connectionMessage;
    messages.appendChild(el);
    

});
//     var getData = function() {
// ajaxRequest({
//     url:"/messages",
//     method:"GET",
//     callback: function(msg){
//         msg = JSON.parse(msg) 

//     }
// })
//     };
//     var getUsers = function() {
//         ajaxRequest({
//             url:"/users",
//             method:"GET",
//             callback: function(user){
//                 user = JSON.parse(user) 
//                 users.innerHTML = "";
//                 for (var i in user) {
//                     if (user.hasOwnProperty(i)) {
//                         var el = document.createElement('li');
//                         el.innerText = user[i].name + ": " +"(@"+user[i].nickname+")";
//                         users.appendChild(el);
//                      }
//                 }
//             }
//         })
//             };

 

//     getData();
//     getUsers();
//     setInterval(function(){
//         getData();
//         getUsers();
//     },1000);



});