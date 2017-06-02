var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userPredictionSchema = new Schema({
 Player1: {type:Schema.Types.ObjectId, ref:"Player"},
    Player2: {type:Schema.Types.ObjectId, ref:"Player"},
    Winner: {type:Schema.Types.ObjectId, ref:"Player"},
    TournamentId: {type:Schema.Types.ObjectId, ref:"Tournament"},
    Round: Number,
    PredictedBy: {type:Schema.Types.ObjectId, ref:"User"}
});

var userPrediction = mongoose.model('UserPrediction', userPredictionSchema);
module.exports = userPrediction;