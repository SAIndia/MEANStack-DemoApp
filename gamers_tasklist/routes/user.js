var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

//Login user 
router.post('/userlogin', function (request, response) {
    var userCredentials = request.body;

    User.GetUserByCredentials(userCredentials, function (error, user) {
        if (error) {
            throw error;
        }

        if (user != null) {
            response.json(user);
        }
        else {
            response.json({ message: 'Invalid Username or Password' })
        }
    });

});

//Register user
router.post('/register', function (request, response) {
    var userDetails = request.body;
    var user = new User({
        Name: userDetails.Name,
        Email: userDetails.Email,
        Password: userDetails.Password
    });
    user.save(function (error, newUser) {
        if (error) {
            return console.error(error);
        }
        response.json("User added successfully");
    });
});

//Register user
router.post('/changepassword', function (request, response) {
    var details = request.body;
    var userId = details.UserId;
    var currentPassword = details.CurrentPassword;
    var newPassword = details.NewPassword;
    var confirmedPassword = details.ConfirmedPassword;

    if (newPassword == confirmedPassword) {

        User.findOne({ $and: [{ _id: userId }, { Password: currentPassword }] }, function (error, user) {
            if (user != 'undefined' && user != null) {
                user.Password = newPassword;
                user.save(function (error) {
                    if (error) {
                        response.json({ success: false, message: error });
                    }
                    response.json({ success: true, message: "Password changed successfully" });
                });
            }
            else {
                response.json({ success: false, message: "Current password is incorrect" });
            }
        });

    }
    else {
        response.json({ success: false, message: "New and confirmed password doesn't match" });
    }

});

module.exports = router;