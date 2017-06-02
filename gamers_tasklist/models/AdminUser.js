var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var adminUserSchema = new Schema({
 Name: String,
    Email: String,
    Password: String
});

var AdminUser = mongoose.model('AdminUser', adminUserSchema);
module.exports = AdminUser;

module.exports.getUserDetails = function (userCredential, callback) {    
    var query = { Email:userCredential.Email, Password:userCredential.Password }
    AdminUser.findOne(query, callback);
}