var express = require('express');
var router = express.Router();

const TriviaGame = require('../database-connection.js');
const _ = require('lodash');
const Question = require('../models/question');
const sequelize = require('sequelize');
const uuid = require('uuid/v4');


/* GET home page. */
router.get('/', function(req, res, next) {
	
});

router.get('/initdb', function(req, res, next) {
	insertQuestionToDatabase(
		"Name Presidents of the United States",
		"George Washington;Washington|John Adams;Adams|Thomas Jefferson;Jefferson|James Madison;Madison|James Monroe;Monroe|John Quincy Adams;Jon Quincy Adams;Quincy Adams|Andrew Jackson;Jackson|Martin Van Buren;Van Buren|William Henry Harrison;Harrison|John Tyler;Tyler|James K. Polk;James K Polk;Polk|Zachary Taylor;Taylor|Millard Fillmore;Fillmore|Franklin Pierce;Pierce|James Buchanan;Buchanan|Abraham Lincoln;Lincoln|Andrew Johnson|Ulysses S. Grant;Ulysses S Grant;Grant|Rutherford B. Hayes;Hayes|James A. Garfield;Garfield|Chester A. Arthur;Arthur|Grover Cleveland;Cleveland|Benjamin Harrison;Harrison|William McKinley;McKinley|Theodore Roosevelt;Teddy Roosevelt;Ted Roosevelt;Roosevelt|William Howard Taft;Taft|Woodrow Wilson;Wilson|Warren G. Harding;Harding|Calvin Coolidge;Coolidge|Herbert Hoover;Hoover|Franklin D. Roosevelt;FDR|Harry S. Truman;S. Truman;S Truman;Truman|Dwight D. Eisenhower;Eisenhower|John F. Kennedy;Kennedy|Lyndon B. Johnson;Johnson|Richard Nixon;Nixon|Gerald Ford;Ford|Jimmy Carter;Carter|Ronald Reagan;Reagan|George H. W. Bush;H W Bush;H. W. Bush;George Bush|Bill Clinton;Clinton|George W. Bush;W. Bush;W Bush|Barack Obama;Obama|Donald Trump;Trump",
		"Science_and_Nature"
	);
	insertQuestionToDatabase(
		"Name US States",
		"Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming"
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
	TriviaGame.create(prepQuestion(question)).then(() => {
		callback(null, question);
	});
}

function getRandomQuestions (amount, callback) {
	TriviaGame.findAll({
		limit: amount, 
		order: [[sequelize.fn('RANDOM')]] 
	}).then(questions => {
		callback(null, questions);
	});
}

function prepQuestion (question) {
	console.log("stringify  " + JSON.stringify(question.answerList));
	return _.assign(question, { answerList: JSON.stringify(question.answerList) });
}

function debriefQuestion (question) {
	console.log("yotta bolo " + question.answerList);
	return _.assign(question, { answerList: JSON.parse(question.answerList) });
}

function debriefQuestions (questions) {
	console.log(questions.map((question) => { console.log(question)}));
	return questions.map((question) => { return debriefQuestion(question); });
}

module.exports = router;