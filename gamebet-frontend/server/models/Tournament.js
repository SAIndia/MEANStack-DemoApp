var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tournamentSchema = new Schema({
TournamentName: { type: String, required: true },
Info: { type: String, required: true },
StartDate: { type: Date, required: true },
EndDate: { type: Date },
LastBetDate: Date,
Image: String,
TournamentTypeId:{type:Schema.Types.ObjectId, ref:"TournamentType"},
PlayersCount: Number,
TournamentStatusId:{type:Schema.Types.ObjectId, ref:"TournamentStatus"},
Players:[],
PlayerResults:[],
UserPredictions:[]
});

var Tournament = mongoose.model('Tournament',tournamentSchema);
module.exports = Tournament;