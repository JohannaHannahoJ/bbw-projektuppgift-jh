const express = require("express");
const router = express.Router();

const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

// öppen route för att läsa kategorier
router.get("/", async (req, res) => {
    try {
        const result = await client.query(
            "SELECT * FROM categories ORDER BY name ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// skyddad route för att lägga till kategorier
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        // validera input
        if (!name) {
            return res.status(400).json({ message: "Skriv namnet på kategorin" });
        }

        // kolla om kategorin finns
        const result = await client.query(
            "SELECT * FROM categories WHERE name = $1", [name]
        );

        // om kategori finns, felmeddelande
        if (result.rows.length > 0) {
            return res.status(409).json({ message: "Kategorin finns redan" });
        }

        // lägg till kategori
        await client.query(
            "INSERT INTO categories (name) VALUES ($1)", [name]
        );

        res.status(201).json({ message: "Kategori skapad" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Skyddad route för att uppdatera kategori
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // validera input
        if (!name) {
            return res.status(400).json({ message: "Skriv namnet på kategorin" });
        }

        // kontrollera om kategorin finns
        const result = await client.query(
            "SELECT * FROM categories WHERE id = $1", [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kategorin hittades inte" });
        }

        // uppdatera kategori
        await client.query(
            "UPDATE categories SET name = $1 WHERE id = $2", [name, id]
        );

        res.status(200).json({ message: "Kategori uppdaterad" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

module.exports = router;
