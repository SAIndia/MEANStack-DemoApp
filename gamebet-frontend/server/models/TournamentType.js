var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tournamentTypeSchema = new Schema({
TournamentTypeName: String
});

var TournamentType = mongoose.model('TournamentType',tournamentTypeSchema);
module.exports = TournamentType;