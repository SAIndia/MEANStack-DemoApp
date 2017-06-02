var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var playerSchema = new Schema({
 Name: String,
 TournamentId: {type:Schema.Types.ObjectId, ref:"Tournament"}
});

var player = mongoose.model('Player',playerSchema);
module.exports = player;