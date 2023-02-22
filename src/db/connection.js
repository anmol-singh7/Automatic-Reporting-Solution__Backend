
const dotenv = require("dotenv")
dotenv.config({ path: "../../.env" });
const mysql = require('mysql2/promise');

// const HOST=process.env.HOST;
// const DATABASE = process.env.DATABASE_NAME;
// const PASSWORD =process.env.PASSWORD;
// const USER = process.env.USER_NAME;

// DATABASE_NAME = "sql7600204"
// USER_NAME = "sql7600204"
// HOST = "sql7.freesqldatabase.com"
// PASSWORD = "PfsXpTIhKK"
const pool = mysql.createPool({
    host: "sql7.freesqldatabase.com",
    user: "sql7600204",
    password: "PfsXpTIhKK",
    database: "sql7600204",
    // port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database!');
        return connection;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return null;
    }
};

module.exports =  {getConnection} ;