const Sequelize = require('sequelize');

const database = 'triviagame',
  host = 'xxx',
  username = 'xxx',
  password = 'xxx';

const pgClient = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres'
});

const Triviagame = pgClient.define('Questions', {
    id: { type: Sequelize.STRING, primaryKey: true },
    QuestionText: { type: Sequelize.STRING },
    AnswersList: { type: Sequelize.STRING },
    Category: { type: Sequelize.INTEGER },
    created: {type: Sequelize.BIGINT }
});

Triviagame.sync().then(() => {
  console.log("Postgres connection ready.");
});

module.exports = Triviagame;