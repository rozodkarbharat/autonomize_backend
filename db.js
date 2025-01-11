const mysql = require("mysql")
require("dotenv").config();

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "sql12757098",
  port: 3306,
  connectionLimit: 10,
});





module.exports = connection;
