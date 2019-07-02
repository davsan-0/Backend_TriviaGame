const Sequelize = require('sequelize');

const database = '---',
  host = '---',
  username = '---',
  password = '---';

const pgClient = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres'
});

const Questions = pgClient.define('Questions', {
  questionText: { type: Sequelize.STRING },
  answerList: { type: Sequelize.TEXT },
  category: { type: Sequelize.STRING }
});

const Sessions = pgClient.define('Sessions', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  code: { type: Sequelize.STRING(4) },
  port: { type: Sequelize.INTEGER }
});

Questions.sync();

Sessions.sync().then(() => {
  console.log("Postgres connection ready.");
});

module.exports = { Questions, Sessions };