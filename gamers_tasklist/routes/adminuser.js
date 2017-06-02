var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var AdminUser = require('../models/AdminUser.js');

//Get All Admin Users
router.get('/adminusers', function(request, response, next) {   
    
    AdminUser.find(function(error, adminList) {
        if(error){
            response.send(error);
        }
        response.json(adminList);
    });
});

//Login user 
router.post('/login', function (request, response) {
    var userCredential = request.body;
    
    AdminUser.getUserDetails(userCredential, function (error, user) {
        if(error) { throw error; }
        if(user != null){
            
            response.json(user);
        }
        else {
            response.json({message:'Invalid Username or Password'})
        }
    });
    
});

module.exports = router;