var express = require('express');
var router = express.Router();
var reversePopulate = require('mongoose-reverse-populate');
var Tournament = require(__base + 'server/models/Tournament');
var UserPrediction = require(__base + 'server/models/UserPrediction');
var Player = require(__base + 'server/models/Player');
var PlayerResult = require(__base + 'server/models/PlayerResult');
var TournamentStatus = {
    Published: "58391d19dbbdd237f06b5117",
    Archived: "58391d19dbbdd237f06b5118",
    Draft: "5841211ff36d2847d850874e"
}

// Get all tournaments not predicted by the user and whose LastBetDate >= today.
router.get('/tournaments/:page?', function (request, response, next) {
    var pageSize = 10, pageNo = 1;
    var userId = request.user.id;
    // Get page no. from request
    if (request.params.page) {
        pageNo = request.params.page > 0 ? request.params.page : 1;
    }
    var statusId = TournamentStatus.Published;
    var skipCount = (pageSize * (pageNo - 1));

    UserPrediction.find({ PredictedBy: userId }, function (error, predictions) {
        var userPredictedTournaments = predictions == [] ? new Array() : predictions.map(function (p) { return p.TournamentId; });
        var today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        console.log(today);
        var query = Tournament.find({ _id: { $nin: userPredictedTournaments }, TournamentStatusId: statusId, LastBetDate: { $gte: today } }).sort('StartDate');

        query.count(function (err, totalCount) {

            query.skip(skipCount).limit(pageSize).exec('find', function (error, tournaments) {

                if (error) {
                    return console.error(error);
                }
                else {
                    // Populate corresponding players for each tournament
                    var opts = {
                        modelArray: tournaments,
                        storeWhere: "Players",
                        arrayPop: true,
                        mongooseModel: Player,
                        idField: "TournamentId"
                    }
                    var result = new Object();
                    reversePopulate(opts, function (err, popTournaments) {

                        result.tournaments = popTournaments;
                        result.totalCount = totalCount;

                        // Populate user predictions
                        opts = {
                            modelArray: result.tournaments,
                            storeWhere: "PlayerResults",
                            arrayPop: true,
                            mongooseModel: PlayerResult,
                            idField: "TournamentId",
                            populate: "Player1 Player2 Winner",
                            sort: { Round: 'asc' }
                        }

                        reversePopulate(opts, function (err, popTournaments) {
                            result.tournaments = popTournaments;
                            response.json(result);
                        });
                    });
                }
            });
        });
    });
});

// Get all tournaments predicted by the user and whose LastBetDate >= today.
router.get('/mytournaments/:page?', function (request, response, next) {

    var pageSize = 10, pageNo = 1;
    var userId = request.user.id;
    // Get page no. from request
    if (request.params.page) {
        pageNo = request.params.page > 0 ? request.params.page : 1;
    }
    var statusId = TournamentStatus.Published;
    var skipCount = (pageSize * (pageNo - 1));

    UserPrediction.find({ PredictedBy: userId }, function (error, predictions) {
        var userPredictedTournaments = predictions == [] ? new Array() : predictions.map(function (p) { return p.TournamentId; });

        var query = Tournament.find({ _id: { $in: userPredictedTournaments }, TournamentStatusId: statusId }).sort('StartDate');

        query.count(function (err, totalCount) {

            query.skip(skipCount).limit(pageSize).exec('find', function (error, tournaments) {

                if (error) {
                    return console.error(error);
                }
                else {
                    // Populate player results
                    var opts = {
                        modelArray: tournaments,
                        storeWhere: "PlayerResults",
                        arrayPop: true,
                        mongooseModel: PlayerResult,
                        idField: "TournamentId",
                        populate: "Player1 Player2 Winner",
                        sort: { Round: 'asc' }
                    }

                    var result = new Object();
                    reversePopulate(opts, function (err, popTournaments) {

                        result.tournaments = popTournaments;
                        result.totalCount = totalCount;

                        // Populate user predictions
                        opts = {
                            modelArray: result.tournaments,
                            storeWhere: "UserPredictions",
                            arrayPop: true,
                            mongooseModel: UserPrediction,
                            idField: "TournamentId",
                            populate: "Player1 Player2 Winner",
                            filters: { PredictedBy: { $eq: userId } },
                            sort: { Round: 'asc' }
                        }

                        reversePopulate(opts, function (err, popTournaments) {
                            result.tournaments = popTournaments;
                            response.json(result);
                        });
                    });
                }
            });
        });
    });
});

// Add User Prediction
router.post("/adduserprediction", function (request, response) {

    var requestBody = request.body;
    var player = requestBody.PlayerId;
    var tournamentId = requestBody.TournamentId;
    var round = requestBody.Round;
    var currentRound = parseInt(round) - 1;
    var isWinner = requestBody.IsWinner;
    var userId = request.user.id;
    var isFirstClick = requestBody.IsFirstClick;

    if (isFirstClick) {

        // Insert UserPrediction -- starts
        var players = requestBody.Players;
        var userPredictions = new Array();

        if (players != 'undefined' && players != null) {
            for (var i = 0; i < players.length; i = i + 2) {
                if (players[i] != '') {

                    var winner = null;
                    var prediction = null;
                    if (player == players[i]._id) {
                        winner = player;
                    }
                    else if (player == players[i + 1]._id) {
                        winner = player;
                    }
                    if (winner != null) {

                        // Inserting player to first round
                        prediction = new UserPrediction({
                            Player1: players[i]._id,
                            Player2: players[i + 1]._id,
                            TournamentId: tournamentId,
                            Round: 1,
                            PredictedBy: userId,
                            Winner: winner
                        });
                        userPredictions.push(prediction);

                        // Inserting winner to the next round
                        prediction= new UserPrediction({
                            Player1: winner,
                            TournamentId: tournamentId,
                            Round: round,
                            PredictedBy: userId
                        });
                        userPredictions.push(prediction);
                    }
                    else {
                        prediction = new UserPrediction({
                            Player1: players[i]._id,
                            Player2: players[i + 1]._id,
                            TournamentId: tournamentId,
                            Round: 1,
                            PredictedBy: userId
                        });
                        userPredictions.push(prediction);
                    }
   
                }
            }
            // UserPrediction bulk insertion
            UserPrediction.insertMany(userPredictions, function (err, results) {
                response.json({ Status: true, Message: 'Prediction added successfully' });
            });

        }
        // Insert UserPrediction -- ends
    }
    else {

        // Set selected player as the winner for the current round
        UserPrediction.findOne({ $and: [{ $or: [{ Player1: player }, { Player2: player }] }, { TournamentId: tournamentId }, { Round: currentRound }, { PredictedBy: userId }] }, function (error, userPrediction) {
            if (userPrediction != 'undefined' && userPrediction != null) {
                userPrediction.Winner = player;
                userPrediction.save();
            }
        });

        // Add selected player to next round
        UserPrediction.findOne({ $and: [{ Player2: { $exists: false } }, { TournamentId: tournamentId }, { Round: round }, { PredictedBy: userId }] }, function (error, userPrediction) {
            if (userPrediction != 'undefined' && userPrediction != null) {
                userPrediction.Player2 = player;
                userPrediction.save();
            }
            else {
                var result;
                // Set selected player as winner if the final match is over
                if (isWinner == true) {
                    result = new UserPrediction({
                        Player1: player,
                        TournamentId: tournamentId,
                        Winner: player,
                        Round: round,
                        PredictedBy: userId
                    });
                }
                else {
                    result = new UserPrediction({
                        Player1: player,
                        TournamentId: tournamentId,
                        Round: round,
                        PredictedBy: userId
                    });
                }
                result.save();
            }
            response.json({ Status: true, Message: 'Prediction added successfully' });
        });
    }
});

// Get tournament by id.
router.get("/tournament/:id", function (request, response) {

    if (request.params.id) {
        var userId = request.user.id;
        Tournament.find({ _id: request.params.id }, function (error, tournament) {
            if (error) {
                return console.error(error);
            }
            else {
                // Populate corresponding players for each tournament
                var opts = {
                    modelArray: tournament,
                    storeWhere: "Players",
                    arrayPop: true,
                    mongooseModel: Player,
                    idField: "TournamentId"
                }
                var result = new Object();
                reversePopulate(opts, function (err, popTournament) {

                    result.tournament = popTournament;

                    // Populate player results
                    opts = {
                        modelArray: result.tournament,
                        storeWhere: "PlayerResults",
                        arrayPop: true,
                        mongooseModel: PlayerResult,
                        idField: "TournamentId",
                        populate: "Player1 Player2 Winner",
                        sort: { Round: 'asc' }
                    }

                    reversePopulate(opts, function (err, popTournament) {
                        result.tournament = popTournament;

                        // Populate user's predictions
                        opts = {
                            modelArray: result.tournament,
                            storeWhere: "UserPredictions",
                            arrayPop: true,
                            mongooseModel: UserPrediction,
                            idField: "TournamentId",
                            populate: "Player1 Player2 Winner",
                            filters: { PredictedBy: { $eq: userId } },
                            sort: { Round: 'asc' }
                        }

                        reversePopulate(opts, function (err, popTournament) {
                            result.tournament = popTournament;
                            response.json(result);
                        });
                    });
                });
            }
        });
    }
});

module.exports = router;