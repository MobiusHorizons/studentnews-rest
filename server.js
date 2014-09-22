// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Entry      = require('./entry.js');

var mongourl = process.env.MONGO_URL || "mongodb://nodejitsu:57a617887a2d96cccfa9cb7d2ee35b52@troup.mongohq.com:10021/nodejitsudb101568878?autoReconnect=true";

mongoose.connect(mongourl);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

router.get('/entries', function (req,res){
    if (req.query.startdate){
        if (!req.query.enddate){
            req.query.enddate = Date.now();
        }
        var query = {$and : 
            [ { date : {$gte : new Date(req.query.startdate) }},
              { date : {$lt  : new Date(req.query.enddate)   }} ]
        };
//        q.find("entries",query, function(data){res.jsonp(data)});
        Entry.find(query, function(err,entries){
            if (err){
                res.jsonp(err);
            }
            res.jsonp(entries);
        });
    } else {
        console.log(req.query);
        res.jsop(Object.keys(req.query));
    }
});

router.get('/search', function (req,res){
	if (req.query.search){
		var query = {
			contents : new RegExp(req.query.search),
			title: new RegExp(req.query.search),
			from: new RegExp(req.query.search)
		};
		Entry.find(query, function(err,entries){
			if (err){
				res.send(err);
			}
			res.jsonp(entries);
		});
	} else {
		res.send({error: "no search parameter"});
	}
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("listening on port " + port);
