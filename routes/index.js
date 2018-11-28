var express = require('express');
var router = express.Router();
var connection = require('../database-connection');




/* GET home page. */
router.get('/', function(req, res, next) {

	/*connection.end(function (err){
		if (err) throw err;
	});*/
	console.log("OUTRSIDE");
	connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
	  	if (err) {
	  		throw err
	  	} 
	  	console.log('The solution is: ', results[0].solution);
	  	res.send("EHHEH");
	  	console.log("HEJ");
	  	res.json(rows);
	});
	
	//res.send("dnb");
  //res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
	res.send("test");
});


module.exports = router;