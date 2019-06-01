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
  questionText: { type: Sequelize.STRING },
  answersList: { type: Sequelize.TEXT },
  category: { type: Sequelize.STRING }
});

const Sessions = pgClient.define('Sessions', {
  code: { type: Sequelize.STRING },
  port: { type: Sequelize.STRING }
});

Triviagame.sync().then(() => {
  console.log("Postgres connection ready.");
});

module.exports = Triviagame;