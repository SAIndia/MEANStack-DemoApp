var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tournamentStatusSchema = new Schema({
TournamentStatusName: String
});

var TournamentStatus = mongoose.model('TournamentStatus',tournamentStatusSchema);
module.exports = TournamentStatus;