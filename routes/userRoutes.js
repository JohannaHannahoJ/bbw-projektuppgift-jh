const express = require("express");
const router = express.Router();

const client = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");
const requireAdmin = require("../middleware/requireAdmin");

// hämta användare - skyddas med admin auth
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await client.query(
            `SELECT * FROM users ORDER BY account_created DESC`
        );
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Registrera användare - skyddas med admin auth 
router.post("/register", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { username, password, is_admin = false } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Fyll i användarnamn och lösenord" });
        }

        // Kontrollera att användarnamnet är minst 4 tecken
        if (username.length < 4) {
            return res.status(400).json({
                message: "Användarnamnet måste vara minst 4 tecken."
            });
        }

        // Kontrollera att lösenordet är minst 8 tecken
        if (password.length < 8) {
            return res.status(400).json({ message: "Lösenordet måste vara minst 8 tecken." })
        }

        // kolla om användare finns
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        );

        // om användare med samma namn finns, felmeddelande
        if (result.rows.length > 0) {
            return res.status(409).json({ message: "Registreringen misslyckades" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // skapa användare
        await client.query(
            "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3)", [username, hashedPassword, is_admin]
        );

        res.status(201).json({ message: "Användare skapad" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// ta bort användare, skyddad route, endast admin kommer åt
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    
    try {
        const { id } = req.params;
        // kolla om användare finns
        const result = await client.query(
            "SELECT * FROM users WHERE id = $1", [id]
        );

        // om admin försöker ta bort sig själv
        if (Number(id) === req.user.id) {
            return res.status(400).json({ message: "Det går inte att ta bort sitt eget konto" });
        }

        // om användare inte finns, felmeddelande
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Användaren finns inte" });
        }

        await client.query(
            "DELETE FROM users WHERE id = $1", [id]
        );

        res.status(200).json({ message: "Användare raderad" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Logga in användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // validera input
        if (!username || !password) {
            return res.status(400).json({ message: "Fyll i användarnamn och lösenord" });
        }

        // hämta user
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        );

        // om användare inte finns
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
        }

        // spara matchande användaren från db
        const user = result.rows[0];

        // jämför inmatat lösenord med hashat lösenord från db
        const passwordMatch = await bcrypt.compare(password, user.password);

        // om password inte stämmer, felmeddelande och hoppa ur funktionen
        if (!passwordMatch) {
            return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
        }

        // skapa payload
        const payload = {
            id: user.id,
            username: user.username,
            is_admin: user.is_admin
        };

        // skapa en JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // korrekt login
        res.status(200).json({ message: "Lyckad inloggning!", token, is_admin: user.is_admin });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

module.exports = router;