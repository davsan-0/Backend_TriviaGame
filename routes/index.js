var express = require('express');
var router = express.Router();

const Tables = require('../database-connection');
const _ = require('lodash');
const Question = require('../models/question');
const Session = require('../models/session');
const sequelize = require('sequelize');
const uuid = require('uuid/v4');
const TcpServer = require('../tcpserver')

const PORT_START = 19000;
const PORT_END = 19999;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send("Crab");
});

router.get('/initdb', function(req, res, next) {
	insertQuestionToDatabase(
		"Name Presidents of the United States",
		"George Washington;Washington|John Adams;Adams|Thomas Jefferson;Jefferson|James Madison;Madison|James Monroe;Monroe|John Quincy Adams;Jon Quincy Adams;Quincy Adams|Andrew Jackson;Jackson|Martin Van Buren;Van Buren|William Henry Harrison;Harrison|John Tyler;Tyler|James K. Polk;James K Polk;Polk|Zachary Taylor;Taylor|Millard Fillmore;Fillmore|Franklin Pierce;Pierce|James Buchanan;Buchanan|Abraham Lincoln;Lincoln|Andrew Johnson|Ulysses S. Grant;Ulysses S Grant;Grant|Rutherford B. Hayes;Hayes|James A. Garfield;Garfield|Chester A. Arthur;Arthur|Grover Cleveland;Cleveland|Benjamin Harrison;Harrison|William McKinley;McKinley|Theodore Roosevelt;Teddy Roosevelt;Ted Roosevelt;Roosevelt|William Howard Taft;Taft|Woodrow Wilson;Wilson|Warren G. Harding;Harding|Calvin Coolidge;Coolidge|Herbert Hoover;Hoover|Franklin D. Roosevelt;FDR|Harry S. Truman;S. Truman;S Truman;Truman|Dwight D. Eisenhower;Eisenhower|John F. Kennedy;Kennedy|Lyndon B. Johnson;Johnson|Richard Nixon;Nixon|Gerald Ford;Ford|Jimmy Carter;Carter|Ronald Reagan;Reagan|George H. W. Bush;H W Bush;H. W. Bush;George Bush|Bill Clinton;Clinton|George W. Bush;W. Bush;W Bush|Barack Obama;Obama|Donald Trump;Trump",
		"Science_and_Nature"
	);
	insertQuestionToDatabase(
		"Name US States",
		"Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming",
		"Science_and_Nature"
	);
	insertQuestionToDatabase(
		"Name Countries in Europe",
		"Albania|Andorra|Armenia|Austria|Azerbaijan|Belarus|Belgium|Bosnia and Herzegovina;Bosnia|Bulgaria|Croatia|Cyprus|Czech Republic;Czech|Denmark|Estonia|Finland|France|Georgia|Germany|Greece|Hungary|Iceland|Ireland|Italy|Kazakhstan|Kosovo|Latvia|Liechtenstein|Lithuania|Luxembourg|Macedonia;FYROM|Malta|Moldova|Monaco|Montenegro|Netherlands;Holland|Norway|Poland|Portugal|Romania|Russia|San Marino|Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|Turkey|Ukraine|United Kingdom;UK|Vatican City;Holy See",
		"Science_and_Nature"
	);
});

router.get('/questions', function(req, res, next) {
	if (!req.query.limit)
	{
		req.query.limit = 100;
	}
	getRandomQuestions(req.query.limit, function(err, questions) {
		res.send(questions);
	});
});

router.get('/host', function(req, res, next) {
	
	Tables.Sessions.findAll({
		limit: 1,
		order: [ ['port', 'DESC'] ]
	}).then(object => {
		console.log("port = " + object[0].port);
		//var newPort = (object[0].port >= PORT_END) ? PORT_START : object[0].port + 1;
		var newPort = object[0].port + 1;
		if (newPort > PORT_END )
		{
			next(new Error('PORT OUT OF RANGE'));
			return;
		} else if (newPort < PORT_START)
		{
			newPort = PORT_START;
		}
		var code = generateCode();
		let session = new Session(code, newPort);

		Tables.Sessions.create(session).then(() => {
			TcpServer.startServer(newPort);
			res.send(JSON.stringify(session));
		});
	});
	
});

router.get('/join', function(req, res, next) {
	Tables.Sessions.findOne({ where: {code: req.query.code}, attributes: ['code', 'port'] }).then(object => {
		res.send(JSON.stringify(object));
	});
});

router.get('/insert', function(req, res, next) {
	insertQuestionToDatabase (req.query.questionText, req.query.answerList, req.query.category, function (err, question) {
		if (err)
		{
			console.log(err);
			res.send("errr");
		}
		res.send(question);
	});
});

function insertQuestionToDatabase (questionText, answerList, category, callback)
{
	let question = new Question(uuid(), questionText, answerList, category);
	Tables.Questions.create(prepQuestion(question)).then(() => {
		callback(null, question);
	});
}

function getRandomQuestions (amount, callback) {
	Tables.Questions.findAll({
		limit: amount, 
		order: [[sequelize.fn('RANDOM')]] 
	}).then(questions => {
		callback(null, questions);
	});
}

function prepQuestion (question) {
	return _.assign(question, { answerList: JSON.stringify(question.answerList) });
}

function debriefQuestion (question) {
	return _.assign(question, { answerList: JSON.parse(question.answerList) });
}

function debriefQuestions (questions) {
	console.log(questions.map((question) => { console.log(question)}));
	return questions.map((question) => { return debriefQuestion(question); });
}

function generateCode() {
	return uuid().substring(0, 4).toUpperCase();
}

module.exports = router;