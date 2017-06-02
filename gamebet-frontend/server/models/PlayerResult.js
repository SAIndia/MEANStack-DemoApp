var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var playerResultSchema = new Schema({
 Player1: {type:Schema.Types.ObjectId, ref:"Player"},
 Player2: {type:Schema.Types.ObjectId, ref:"Player"},
 Winner: {type:Schema.Types.ObjectId, ref:"Player"},
 TournamentId: {type:Schema.Types.ObjectId, ref:"Tournament"},
 Round: Number
});

var playerResult = mongoose.model('PlayerResult', playerResultSchema);
module.exports = playerResult;