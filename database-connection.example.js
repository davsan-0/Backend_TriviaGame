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
  answersList: { type: Sequelize.STRING },
  category: { type: Sequelize.INTEGER }
});

const Sessions = pgClient.define('Sessions', {
  code: { type: Sequelize.STRING },
  ip: { type: Sequelize.STRING }
});

Triviagame.sync().then(() => {
  console.log("Postgres connection ready.");
});

module.exports = Triviagame;