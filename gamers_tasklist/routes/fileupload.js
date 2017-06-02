var express = require('express');
var router = express.Router();
var tournamentImagePath =  __base + 'client/uploads/tournamentimages/';

var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, tournamentImagePath);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    
    router.post('/upload', function(req, res) {
        upload(req,res,function(err){
            console.log(req.file.filename);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null,filename:req.file.filename});
        });
    });
    
module.exports = router;