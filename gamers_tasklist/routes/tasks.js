var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('mongodb://sabeesh:change123#@ds155097.mlab.com:55097/db_gamerstasklist',['betting','Players']);

//Get All Bettings
router.get('/tasks', function(request, response, next) {
    //response.send('TASK API');
    db.betting.find(function(error, bettingList) {
        if(error){
            response.send(error);
        }
        response.json(bettingList);
    });
});

//Get Single Bettings
router.get('/tasks/:id', function(request, response, next) {
    db.betting.findOne({_id: mongojs.ObjectId(request.params.id)}, function(error, bet) {
        if(error){
            response.send(error);
        }
        response.json(bet);
    });
});

//Get All Players
router.get('/players', function(request, response, next) {
    db.Players.find(function(error, playerList) {
        if(error){
            response.send(error);
        }
        response.json(playerList);
    });
});

module.exports = router;