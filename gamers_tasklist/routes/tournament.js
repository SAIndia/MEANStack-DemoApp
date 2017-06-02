var express = require('express');
var router = express.Router();
var Tournament = require(__base + 'models/tournament');
var TournamentStatus = require(__base + 'models/tournamentstatus');
var TournamentTypes = require(__base + 'models/tournamenttype');
var Player = require(__base + 'models/Player');
var PlayerResult = require(__base + 'models/PlayerResult');
var DateTimeUtility = require(__base + 'helpers/datetimeutility');
var tournamentImagePath = __base + 'client/uploads/tournamentimages/';
var multiparty = require('multiparty');
var fs = require('fs');
var reversePopulate = require('mongoose-reverse-populate');
var User = require(__base + 'models/User');
var UserPrediction = require(__base + 'models/UserPrediction');

// Get all tournaments whose LastBetDate >= today.
router.get('/tournaments/:page?/:status?', function (request, response, next) {
    var today = new Date();
    var pageSize = 10, pageNo = 1;
    // Get page no. from request
    if (request.params.page) {
        pageNo = request.params.page > 0 ? request.params.page : 1;
    }
    var statusId = request.params.status;
    var skipCount = (pageSize * (pageNo - 1));
    var query;
    if (statusId) {
        query = Tournament.find({ TournamentStatusId: statusId }).sort('StartDate');
    }
    else {
        query = Tournament.find().sort('StartDate');
    }
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

                    // Populate player results
                    opts = {
                        modelArray: result.tournaments,
                        storeWhere: "PlayerResults",
                        arrayPop: true,
                        mongooseModel: PlayerResult,
                        idField: "TournamentId",
                        populate :"Player1 Player2 Winner"
                    }

                    reversePopulate(opts, function (err, popTournaments) {
                        result.tournaments = popTournaments;

                     // Populate user's predictions
                        opts = {
                            modelArray: result.tournaments,
                            storeWhere: "UserPredictions",
                            arrayPop: true,
                            mongooseModel: UserPrediction,
                            idField: "TournamentId"
                        }

                    reversePopulate(opts, function (err, popTournaments) {
                            result.tournaments = popTournaments;
                            response.json(result);
                        });
                    });
                });
            }

        });
    });
});

// Get tournament by id.
router.get("/tournament/:id", function (request, response) {

    if (request.params.id) {
        Tournament.find({ _id: request.params.id }, function (error, tournament) {
            if (error) {
                return console.error(error);
            }
            else {
                //response.json(tournament);

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
                    //result.totalCount = totalCount;

                    // Populate player results
                    opts = {
                        modelArray: result.tournament,
                        storeWhere: "PlayerResults",
                        arrayPop: true,
                        mongooseModel: PlayerResult,
                        idField: "TournamentId",
                        populate :"Player1 Player2 Winner"
                    }

                    reversePopulate(opts, function (err, popTournament) {
                        result.tournament = popTournament;

                    // Populate user predictions
                        opts = {
                            modelArray: result.tournament,
                            storeWhere: "UserPredictions",
                            arrayPop: true,
                            mongooseModel: UserPrediction,
                            idField: "TournamentId"
                        }

                    reversePopulate(opts, function (err, popTournaments) {
                            result.tournament = popTournament;
                            response.json(result);
                        });

                    });
                });
            }
        });
    }
});

// Add new tournament
router.post("/AddTournament", function (request, response) {
    var body = request.body;
    var tournament = new Tournament({
        TournamentName: body.TournamentName,
        Info: body.Info,
        StartDate: body.StartDate,
        EndDate: body.EndDate,
        LastBetDate: body.LastBetDate,
        TournamentTypeId: "58391b445c350b109cbc941c", // TT
        PlayersCount: body.PlayersCount,
        TournamentStatusId: body.TournamentStatusId
    });

    var newPlayers = [];
    tournament.save(function (error, newTournament) {
        if (error) {
            return console.error(error);
        }

        // Insert Player -- starts
        var players = body.Players;
        var newPalyers = new Array();

        if (players != 'undefined' && players != null) {
            for (var i = 0; i < players.length; i++) {
                if (players[i] != '') {
                    var player = new Player({
                        Name: players[i],
                        TournamentId: newTournament._id
                    });
                    newPalyers.push(player);
                }
            }

            // Players bulk insert
            Player.insertMany(newPalyers, function (err, insertedPalyers) {
                var playerResults = new Array();
                for (var i = 0; i < insertedPalyers.length; i = i + 2) {
                    var playerResult = new PlayerResult({
                        Player1: insertedPalyers[i]._id,
                        Player2: insertedPalyers[i + 1]._id,
                        TournamentId: newTournament._id,
                        Round: 1
                    });
                    playerResults.push(playerResult);
                }

                // Player results bulk insert
                PlayerResult.insertMany(playerResults, function (err, results) {
                });
            });
        }
        // Insert Player -- ends

        // Rename tournament image
        var fileName = body.Image;
        if (fileName != "") {
            var fileNameParts = fileName.split(".");
            var fileType = fileNameParts[fileNameParts.length - 1];
            var currentFilePath = tournamentImagePath + fileName;
            var newFileName = newTournament._id + "." + fileType;
            var filePath = tournamentImagePath + newFileName;
            // Rename uploaded file
            fs.rename(currentFilePath, filePath, function (fileError) {
                if (fileError) {
                    response.json('Error: Tournament logo not saved');
                }
                else {
                    Tournament.findOne({ _id: newTournament._id }, function (error, insertedTournament) {
                        if (insertedTournament != 'undefined' && insertedTournament != null) {
                            insertedTournament.Image = newFileName;
                            insertedTournament.save(function (err) {
                                if (err) {
                                       response.json('Error: Tournament not saved');
                                }
                                response.json('Tournament added successfully');
                            });
                        }
                    });
                }
            });
        }

    });
});

// Update tournament
router.post('/updatetournament', function (request, response, next) {
    var body = request.body;
    var tournamentId = body.TournamentId;

    Tournament.findOne({ _id: tournamentId }, function (error, tournament) {
        if (error) {
            return console.error(error);
        }
        else if (tournament != 'undefined' && tournament != null) {
            tournament.TournamentName = body.TournamentName;
            tournament.Info = body.Info;
            tournament.StartDate = body.StartDate;
            tournament.EndDate = body.EndDate;
            tournament.LastBetDate = body.LastBetDate;
            //tournament.TournamentTypeId = request.body.tournamenttype;
            tournament.PlayersCount = body.PlayersCount;
            tournament.TournamentStatusId = body.TournamentStatusId;

            // Rename tournament image
            var fileName = body.Image;
            var newFileName = "";
            if (fileName != "") {
                var fileNameParts = fileName.split(".");
                var fileType = fileNameParts[fileNameParts.length - 1];
                var currentFilePath = tournamentImagePath + fileName;
                newFileName = tournamentId + "." + fileType;
                var filePath = tournamentImagePath + newFileName;
                // Rename uploaded file
                fs.rename(currentFilePath, filePath, function (fileError) {
                    if (fileError) {
                        console.log('File error: ' + fileError);
                    }
                });
                tournament.Image = newFileName;
            }
            tournament.save(function (err) {
                if (err) {
                    return console.error(err);
                }
                //Remove existing players
                Player.find({ TournamentId: tournamentId }, function (er, existingPlayers) {
                    if (er) {
                        return console.error('Players error: ' + er);
                    }
                    else if (existingPlayers != 'undefined' && existingPlayers != null) {
                        for (var i = 0; i < existingPlayers.length; i++) {

                            // Remove players from player result
                            PlayerResult.find({ $or: [{ Player1: existingPlayers[i]._id }, { Player2: existingPlayers[i]._id }] }).remove().exec();

                            existingPlayers[i].remove();
                        }
                    }
                });

                // Insert Player -- starts
                var players = body.Players;
                var newPalyers = new Array()
                if (players != 'undefined' && players != null) {
                    for (var i = 0; i < players.length; i++) {
                        if (players[i] != '') {
                            var player = new Player({
                                Name: players[i],
                                TournamentId: tournamentId
                            });
                            newPalyers.push(player);
                        }
                    }

                    // Players bulk insert
                    Player.insertMany(newPalyers, function (err, insertedPalyers) {

                        var playerResults = new Array();
                        for (var i = 0; i < insertedPalyers.length; i = i + 2) {
                            var playerResult = new PlayerResult({
                                Player1: insertedPalyers[i]._id,
                                Player2: insertedPalyers[i + 1]._id,
                                TournamentId: tournamentId,
                                Round: 1
                            });
                            playerResults.push(playerResult);
                        }

                        // Player results bulk insert
                        PlayerResult.insertMany(playerResults, function (err, results) {

                        });
                    });

                }
                // Insert Player -- ends

                response.json("Tournament updated successfully");
            });
        }
    });
});

// Archive tournament
router.post('/archivetournaments', function (request, response, next) {
    var tournaments = request.body.ArchiveTournamets;
    var arciveStatusId = request.body.TournamentStatus;
    var tournamentIds = tournaments.map(function (tournament) { return tournament.TournamentId });

    if (tournamentIds.length > 0) {
        var condition = { _id: { $in: tournamentIds } }, updateQuery = { $set: { TournamentStatusId: arciveStatusId } }, options = { multi: true };
        Tournament.update(condition, updateQuery, options, function () {
            response.json("Tournaments archived successfully");
        });
    }
    else {
        response.json("No tournaments selected");
    }
});

// Delete tournament
router.post('/deletetournament', function (request, response, next) {
    var tournamentId = request.body.tournamentid;
    Tournament.findOne({ _id: tournamentId }, function (err, tournament) {
        if (tournament != 'undefined' && tournament != null) {
           
            //Remove player results
            PlayerResult.find( { TournamentId: tournamentId } ).remove().exec();
           
            //Remove players 
            Player.find( { TournamentId: tournamentId } ).remove().exec();

            //Remove tournament
            tournament.remove();
        }
        response.json("Tournament deleted successfully");
    });
});

// Get all tournament types.
router.get("/tournamenttypes", function (request, response) {

    TournamentTypes.find(function (error, tournamentTypes) {
        if (error) {
            return console.error(error);
        }
        response.json(tournamentTypes);
    });
});

// Get all tournament statuses.
router.get("/tournamentstatuses", function (request, response) {

    TournamentStatus.find(function (error, tournamentstatuses) {
        if (error) {
            return console.error(error);
        }
        response.json(tournamentstatuses);
    });
});

// Add player to tournament
router.post("/addplayer", function (request, response) {
    var player = new Player({
        Name: request.body.name,
        TournamentId: request.body.tournamentid
    });
    player.save(function (error) {
        if (error) {
            return console.error(error);
        }
        response.json("Player added successfully");
    });
});

// Delete player
router.post('/deleteplayer', function (request, response, next) {
    var playerId = request.body.playerid;
    Player.findOne({ _id: playerId }, function (error, player) {
        if (player != 'undefined' && player != null) {
            player.remove();
        }
        response.json("Player deleted successfully");
    });
});

// Add player result
router.post("/addplayerresult", function (request, response) {

    var player = request.body.PlayerId;
    var tournamentId = request.body.TournamentId;
    var round = request.body.Round;
    var currentRound = parseInt(round) - 1;
    var playerCount = request.body.TotalPlayers;
    var isWinner = request.body.IsWinner;

    // Set selected player as the winner for the current round
    PlayerResult.findOne({ $and: [{ $or: [{ Player1: player }, { Player2: player }] }, { TournamentId: tournamentId }, { Round: currentRound }] }, function (error, playerResult) {
        if (playerResult != 'undefined' && playerResult != null) {
            playerResult.Winner = player;
            playerResult.save();
        }
    });

    // Add selected player to next round
    PlayerResult.findOne({ $and: [{ Player2: { $exists: false } }, { TournamentId: tournamentId }, { Round: round }] }, function (error, playerResult) {
        if (playerResult != 'undefined' && playerResult != null) {
            playerResult.Player2 = player;
            playerResult.save();
        }
        else {
            var result;
            // Set selected player as winner if the final match is over
            if (isWinner == true) {
                result = new PlayerResult({
                    Player1: player,
                    TournamentId: tournamentId,
                    Winner: player,
                    Round: round
                });
            }
            else {
                result = new PlayerResult({
                    Player1: player,
                    TournamentId: tournamentId,
                    Round: round
                });
            }
            result.save();
        }
        response.json("Player result added successfully");
    });
});

module.exports = router;