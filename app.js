var express = require('express');
var http = require('http');

var subscribeChannelController = require('./controllers/subscribeChannelController');

var app=express();


app.listen(8282);

app.set('view engine', 'ejs');


subscribeChannelController(app);

