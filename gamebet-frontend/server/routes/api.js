var express = require('express');
var router = express.Router();

var User = require(__base + 'server/models/User')

/* GET api listing. */
router.get('/', (req, res) => {
    /*var user = new User({
        Name: 'Sabeesh',
        Email: 'sabu@sa.com',
        Password: 'change'
    });

    user.save(function (error, newUser) {
        if (error) {
            throw error
        }
        console.log('New User Saved.' + newUser._id);
    });*/
    res.send('api works');
});

module.exports = router;