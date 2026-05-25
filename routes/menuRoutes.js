const express = require("express");
const router = express.Router();


const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

// öppen route för att läsa meny-items
router.get("/", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                menu_items.*,
                categories.name AS category_name
            FROM menu_items
            JOIN categories ON menu_items.category_id = categories.id
            ORDER BY 
                categories.name ASC,
                menu_items.is_available DESC,
                menu_items.name ASC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// skyddad route för att lägga till meny-items
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, price, description, is_available, is_offer, category_id } = req.body;

        // validera input
        if (!name || !price || !category_id) {
            return res.status(400).json({ message: "Namn, pris och kategori måste fyllas i!" });
        }

        // kolla om maträtten redan finns
        const result = await client.query(
            "SELECT * FROM menu_items WHERE name = $1", [name]
        );

        // om finns, felmeddelande
        if (result.rows.length > 0) {
            return res.status(409).json({ message: "Rätten finns redan" });
        }

        // lägg till
        await client.query(
            `INSERT INTO menu_items 
            (name, price, description, is_available, is_offer, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [name, price, description || "", is_available ?? true, is_offer ?? false, category_id]
        );

        res.status(201).json({ message: "Rätt tillagd" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Skyddad route för att uppdatera menu_item
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, is_available, is_offer, category_id } = req.body;

        // validera input
        if (!name || !price || !category_id) {
            return res.status(400).json({ message: "Namn, pris och kategori måste fyllas i!" });
        }

        // kontrollera om rätten finns
        const result = await client.query(
            "SELECT * FROM menu_items WHERE id = $1", [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Rätten hittades inte" });
        }

        // uppdatera kategori
        await client.query(
            `UPDATE menu_items 
             SET name = $1, price = $2, description = $3, is_available = $4, is_offer = $5, category_id = $6
             WHERE id = $7`,
            [name, price, description, is_available, is_offer, category_id, id]
        );

        res.status(200).json({ message: "Maträtt uppdaterad" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // kolla om item finns
        const result = await client.query(
            "SELECT * FROM menu_items WHERE id = $1", [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Rätten hittades inte" });
        }

        // ta bort
        await client.query(
            "DELETE FROM menu_items WHERE id = $1", [id]
        );

        res.status(200).json({ message: "Rätt borttagen" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

module.exports = router;