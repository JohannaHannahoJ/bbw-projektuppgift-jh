// Inställningar för att ansluta till databasen

const { Client, Pool } = require("pg");
require("dotenv").config();

// Inställningar för att ansluta till databasen
const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.on("error", (err) => {
    console.log("Connection error: " + err);
});

console.log("Connected to database.");


module.exports = client;