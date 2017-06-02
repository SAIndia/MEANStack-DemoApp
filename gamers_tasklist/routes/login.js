var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('mongodb://sabeesh:change123#@ds155097.mlab.com:55097/db_gamerstasklist',['AdminUsers']);

//Get All Bettings
router.get('/login', function(request, response, next) {
    //response.send('TASK API');
    db.AdminUsers.find(function(error, adminList) {
        if(error){
            response.send(error);
        }
        response.json(adminList);
    });
});

//Get Single Bettings
router.post('/login', function(request, response, next) {
    //console.log(request.Email);
    response.json(request.Email);
});



module.exports = router;