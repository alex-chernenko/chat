var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var messages = [];
var users = [];
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.get('/', function (req, res) {
    res.sendfile('index.html');
    
});

app.get('/messages', function (req, res) {
    res.json(messages);
});
app.get('/users', function (req, res) {
    res.json(users);
});
app.post('/users', function (req, res) {
    users.push(req.body);
});
app.post('/messages', function (req, res) {
    messages.push(req.body);
});

app.use(express.static(__dirname + '/public'));
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});