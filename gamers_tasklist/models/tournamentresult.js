var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tournamentResultSchema = new Schema({
 TournamentId: {type:Schema.Types.ObjectId, ref:"Tournament"},
 PlayerId: {type:Schema.Types.ObjectId, ref:"Player"},
 IsWinner: Boolean
});

var tournamentResult = mongoose.model('TournamentResult', tournamentResultSchema);
module.exports = tournamentResult;