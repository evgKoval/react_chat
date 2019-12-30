const Pool = require("pg").Pool;

module.exports = new Pool({
  // user: process.env.RDS_USERNAME,
  // host: process.env.RDS_HOSTNAME,
  // database: process.env.RDS_DATABASE,
  // password: process.env.RDS_PASSWORD,
  // port: process.env.RDS_PORT
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
