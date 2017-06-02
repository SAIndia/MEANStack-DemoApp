var express = require('express');
var router = express.Router();

var AdminUser = require('../models/AdminUser.js')

router.get('/', function(request, response, next) {  
 
      /*var adminUser = new AdminUser({
          Name: 'Sabu',
          Email: 'sabu@gmail.com',
          Password: 'change123#'
      });

      adminUser.save(function (err) {
          if (err)
              throw err;
  
          console.log('building saved successfully!');
          
      });*/
      
      response.render('index.html');
  
});

module.exports = router;