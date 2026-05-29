const express = require("express");
const router = express.Router();
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

// skapa meddelande från public
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Alla fält måste fyllas i." });
        }

        await client.query(
            `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)`, [name, email, message]
        );
        res.status(201).json({ message: "Meddelandet har skickats." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Hämta meddelanden från admin
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await client.query(
            `SELECT * FROM messages ORDER BY created_at DESC`
        );
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Markera som hanterad i admin
router.put("/:id/handled", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await client.query(
            `UPDATE messages SET is_handled = true WHERE id = $1`, [id]
        );
        res.json({ message: "Meddelandet hanterat." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Radera meddelande i admin
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await client.query(
            `DELETE FROM messages WHERE id = $1`, [id]
        );
        res.json({ message: "Meddelandet raderat." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

module.exports = router;