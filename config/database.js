var mysql = require("mysql");
var util = require("util");

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "77.37.35.21",
  user: "u582642816_root",
  database: "u582642816_lionnlioness3",
  password:"5e$Ybj=O",
  port: "3306"
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    console.log("Database connected successfully!"); // Log successful connection
    connection.release(); // Release the connection back to the pool
  }
  return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
