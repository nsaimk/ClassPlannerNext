const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

//Used Pool class instead Client, because operation requires to handle multiple concurrent requests
//The Client class represents a single connection to the PostgreSQL database that suitable for short-lived operations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


//DB is connected, below is to see what tables are in the DB
const query = `
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
`;

pool.query(query, (err, result) => {
  if (err) {
    console.error("Error executing query:", err);
  } else {
    console.log("Tables in the database:");
    result.rows.forEach((row) => {
      console.log(row.table_name);
    });
  }
});

module.exports = { pool };
