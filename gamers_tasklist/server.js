// Set base directory path to global variable
global.__base = __dirname + '/';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var tasks = require('./routes/tasks');
var login = require('./routes/login');
var adminusers = require('./routes/adminuser');
var tournament = require('./routes/tournament');
var fileupload = require('./routes/fileupload');

var port = 3000;

var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder 
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser Middle Ware (MW)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);

app.use('/api', tasks);
//app.use('/api', login);
app.use('/api', adminusers);
app.use('/api', tournament);
app.use('/api', fileupload);

// Connecting database with "bluebird" promise library
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/db_gamerstasklist');

var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', function () {
    console.log('database connection failed');
});
db.once('open', function () {
    console.log('database connected');
});

app.listen(port, function() {
    console.log('Server started on port : ' + port);
})


app.get('*', function(req, res) {
  res.sendfile('./views/index.html')
})