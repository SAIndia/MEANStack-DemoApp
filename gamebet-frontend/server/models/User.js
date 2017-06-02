var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    Name: String,
    Email: String,
    Password: String
});

var User = mongoose.model('User', userSchema);
module.exports = User;