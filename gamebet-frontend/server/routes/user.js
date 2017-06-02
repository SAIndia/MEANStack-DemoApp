var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require(__base + 'server/models/User');

var router = express.Router();

// Passport (authentication middleware) configuration
passport.use(new LocalStrategy({ usernameField: 'Email',passwordField: 'Password'}, function (username, password, done) {
    User.findOne({ Email: username, Password: password }, function (error, user) {
        if (error) { return done(error); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        return done(null, user);
     });
}));

passport.serializeUser(function (user, done) {    
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {    
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// User login using passport
router.post('/userlogin', passport.authenticate('local', {
        successRedirect: '/betting', 
        failureRedirect: '/login', 
        failureMessage: "Invalid username or password" }), function (request, response) {
            
            var userCredential = request.body;
            
            var query = { Email:userCredential.Email, Password:userCredential.Password }           
            
            
            if(request.isAuthenticated()){
                console.log('success man ')
            }
            else{
                request.logout();
                response.json({message:'Invalid Username or Password'})
            }
    
});

// Logout user
router.get('/userlogout', function(request, response) {    
    request.logout();
    response.redirect('/home');    
});

// Checks whether the user is authenticated
router.get('/isUserAuthenticated', function(request, response, next) {    
    if(request.isAuthenticated()) {        
        response.json({ status: true, LoginUser: request.user });
    }
    else {
        response.json({ status: false });
    }
});

// Insert user registeration
router.post('/userRegisteration', function(request, response, next) {
    var body = request.body;
    User.findOne({ Email: body.Email }, function(error, user) {
        if(error) {
            throw error;
        }
        if(user) {
            response.json({ UserExist: true });
        }
        else {
            var newUser = new User({
                Name: body.Name,
                Email: body.Email,
                Password: body.Password
            });

            newUser.save(function (error, user) {
                if (error) {
                    throw error
                }
                request.login(user, function(err) {
                    if (err) { return next(err); }
                    //return res.redirect('/users/' + req.user.username);
                    response.json({ UserExist: false, RegUser: request.user })
                });
            });
            
            
        }
    })
});

// ============================================ FaceBook Authentication =================================================
// Redirect the user to Facebook for authentication.  When complete,
router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

// Facebook will redirect the user back to the application at   /auth/facebook/callback
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/betting',
                                        failureRedirect: '/home' }), function(request, response) {
                                          console.log(response)
                                      });

// Use facebook strategy - Passport configuration for facebook authentication
passport.use(new FacebookStrategy({        
        clientID: '199928727160298',
        clientSecret: 'f29a5919c3a6e3169662eeab25ace5bf',
        callbackURL: 'http://sagamebet.com:4200/api/auth/facebook/callback',
        enableProof: true,
        profileFields: ['id', 'displayName', 'gender', 'age_range', 'emails', 'birthday', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
        // Checks whether a user with same email id exists
        process.nextTick(function () {            
            User.findOne({
                //'facebook.id': profile.id 
                Email: profile.emails[0].value
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                //If user doesn't exist then create a new user with values from Facebook
                if (!user) {
                    user = new User({
                        Name: profile.displayName,
                        Email: profile.emails[0].value,
                        Password: 'change123',
                        //username: profile.username,
                        //provider: 'facebook',
                        //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                        //facebook: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    // If user exists, return the user details
                    return done(err, user);
                }
            });
        })
        
    }
));

// ======================================================================================================================

// ============================================== Google Authentication =================================================
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', {   successRedirect: '/betting', 
                                        failureRedirect: '/home' 
                                    }), function(request, response) {
                                        console.log(response)                                            
                                    });

// Passport configuration for google authentication
passport.use(new GoogleStrategy({
        clientID: '710505886589-tiqrfeugje9hdaeeka2k293iko200rpc.apps.googleusercontent.com',
        clientSecret: '1JXNSNxfjveRSatiVNhw3MNN',
        callbackURL: 'http://sagamebet.com:4200/api/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        // Checks whether a user with same email id exists
        process.nextTick(function() {
            User.findOne({                
                Email: profile.emails[0].value
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                // If user doesn't exist then create a new user.
                if (!user) {
                    user = new User({
                        Name: profile.displayName,
                        Email: profile.emails[0].value,
                        Password: 'change123'
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    // If user exists, return the user details
                    return done(err, user);
                }
            });
        })        
    }
));                                    

// ======================================================================================================================

// Reset user passowrd
router.post('/passwordReset', function(request, response, next) {
    var body = request.body;
    
    var query = { Email:request.user.Email, Password:body.Password } 
    User.findOne(query, function(error, user) {
        if(error) {
            throw error;
        }
        else if(user != 'undefined' && user != null) {
            user.Password = body.ConfirmPassword;
            user.save(function (error) {
                if(error) {
                    throw error;
                }
                response.json({ Status: true });
            })
        }
        else {
            response.json({ Status: false });
        }
    });
    
});

module.exports = router;



