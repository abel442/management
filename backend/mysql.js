import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pino123",
  database: "management", 
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log("Connection failed:", err);
    return;
  }

  console.log("Connected to MySQL!");
});

export default connection;