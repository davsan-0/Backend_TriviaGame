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