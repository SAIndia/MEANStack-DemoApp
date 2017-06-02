// Set base directory path to global variable
global.__base = __dirname + '/';
// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Get our API routes
var api = require('./server/routes/api');
var user = require('./server/routes/user');
var tournament = require('./server/routes/tournament');

var app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));//dist

// Set our api routes
app.use('/api', api);
app.use('/api', user);
app.use('/api', tournament);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Get port from environment and store in Express.
var port = process.env.PORT || '4200';
app.set('port', port);

mongoose.Promise = require('bluebird');
// Define database connection string. Here we use mongoose to connect with the DB.
mongoose.connect('mongodb://192.168.0.179:27017/db_gamerstasklist');

var dbConn = mongoose.connection;
dbConn.on('error', function() {
    console.log('Database Connection Failed.');
});

dbConn.once('open', function () {
    console.log('Database Connected.');
});

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));