var express = require('express');
var router = express.Router();
var connection = require('../database-connection.js');

router.get('/*', function(req, res, next) {
	connection.connect();
	next();
});

router.get('/questions', function(req, res, next) {
	connection.query('SELECT * FROM "TriviaGame"."Questions"', (err, result) => 
	{
	  	if(err) {
	  		console.log(err.stack);
	  		res.json([]);
	  	} else {
	  		console.log(result.rows);
	  		res.json(result.rows);
	  	}
	});
});

router.get('/questions/id/:id', function(req, res, next) {
	connection.query('SELECT * FROM "TriviaGame"."Questions" WHERE "QuestionID"=($1)', [req.params.id], (err, result) => {
	  	if(err) {
	  		console.log(err.stack);
	  		res.json([]);
	  	} else {
	  		console.log(result.rows);
	  		res.json(result.rows);
	  	}
	});
});

router.get('/questions/category/:category', function(req, res, next) {
	connection.query('SELECT * FROM "TriviaGame"."Questions" WHERE "Category"=($1)', [req.params.category], (err, result) => {
	  	if(err) {
	  		console.log(err.stack);
	  		res.json([]);
	  	} else {
	  		console.log(result.rows);
	  		res.json(result.rows);
	  	}
	});
});

router.get('/test', function(req, res, next) {
	res.send("test");
});


module.exports = router;