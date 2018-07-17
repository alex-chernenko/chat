$(document).ready(function(){

    var nameInput = document.getElementById('userName');
    var nickInput = document.getElementById('userNick');
    var messages = document.getElementById('messages');
    var text = document.getElementById('text');
    
    
   
    $("#enter").click(function(){
        $(".chat").css("visibility","visible");
        $("#authorization").css("visibility","hidden");
        userName = nameInput.value || "User Name";
        userNick = nickInput.value || "User Nick";
        
        var user = {
            name: userName,
            nickname: userNick
        };
        console.log(user);
       
        ajaxRequest({
            method: "POST",
            url: "/users",
            data: user
        })
    });
    $("#submit").click(function(){
        
        var data = {
            name: userName,
            text: text.value
        };
        
        text.value = '';
        ajaxRequest({
            method: "POST",
            url: "/messages",
            data: data
        })
    });
    var ajaxRequest = function(options) {
        var url = options.url || '/';
        var method = options.method || 'GET';
        var callback = options.callback || function() {};
        var data = options.data || {};
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(method,url,true);
        xmlHttp.setRequestHeader('Content-Type','application/json');
        xmlHttp.send(JSON.stringify(data));

        
        xmlHttp.onreadystatechange = function() {
            if(xmlHttp.status == 200 && xmlHttp.readyState === 4) {
                callback(xmlHttp.responseText);
            }

        }
    };
    var getData = function() {
ajaxRequest({
    url:"/messages",
    method:"GET",
    callback: function(msg){
        msg = JSON.parse(msg) 
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
    }
})
    };
    var getUsers = function() {
        ajaxRequest({
            url:"/users",
            method:"GET",
            callback: function(user){
                user = JSON.parse(user) 
                users.innerHTML = "";
                for (var i in user) {
                    if (user.hasOwnProperty(i)) {
                        var el = document.createElement('li');
                        el.innerText = user[i].name + ": " +"(@"+user[i].nickname+")";
                        users.appendChild(el);
                     }
                }
            }
        })
            };

 

    getData();
    getUsers();
    setInterval(function(){
        getData();
        getUsers();
    },1000);



});