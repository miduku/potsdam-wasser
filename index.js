'use strict';

var express = require('express');
var config = require('config'); // load default.json
var io = require('socket.io');
var http = require('http');
var path = require('path');
// var fs = require('fs');

var FB = require('fb'),
    FB_TOKEN = config.get('TOKEN');

// create the app
var app = express(),
    server = http.createServer(app),
    socket = io.listen(server),
    port = 3000;

console.log(FB_TOKEN);


app.use(express.static(path.join(__dirname, '/app')));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

FB.setAccessToken(FB_TOKEN);
FB.api('4', { fields: ['id', 'name'] }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res.id);
  console.log(res.name);
});


server.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

