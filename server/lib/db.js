module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL
});
