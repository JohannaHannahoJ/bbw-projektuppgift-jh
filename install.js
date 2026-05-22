const { Client } = require("pg");
require("dotenv").config();

// skapa databasanslutning
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// skapa tabeller
async function install() {
    try {
        await client.connect();
        console.log("Ansluten till Render Postgres");

        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_admin BOOLEAN DEFAULT false
            );

            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS menu_items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                price DECIMAL(6,2),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_available BOOLEAN NOT NULL DEFAULT true,
                is_offer BOOLEAN DEFAULT false,
                category_id INTEGER NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_handled BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await client.query(sql);
        console.log("Tabeller skapade"); // om lyckade tabeller

    } catch (error) {
        console.error(error); // logga ev fel

    } finally {
        await client.end(); // stäng databaskoppling
    }
}

// anropa funktionen
install();