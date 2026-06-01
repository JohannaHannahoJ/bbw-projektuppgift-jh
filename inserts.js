const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function insert() {
    try {
        await client.connect();
        console.log("Ansluten till databasen");

        // Rensa gammal data
        await client.query(`DELETE FROM menu_items`);
        await client.query(`DELETE FROM categories`);

        const categories = [
            "Sushi",
            "Nudlar",
            "Risrätter",
            "Desserter",
            "Drycker",
        ];

        const categoryIds = [];

        for (const name of categories) {
            const result = await client.query(
                `INSERT INTO categories (name)
                 VALUES ($1)
                 RETURNING id`,
                [name]
            );

            categoryIds.push({
                name,
                id: result.rows[0].id
            });
        }

        console.log("Kategorier skapade");

        const menuItems = [
            {
                name: "Liten Sushi",
                price: 80,
                description: "Nio blandade bitar. Kockens val",
                category: "Sushi"
            },
            {
                name: "Mellan Sushi",
                price: 100,
                description: "Elva blandade bitar. Kockens val",
                category: "Sushi"
            },
            {
                name: "Stor Sushi",
                price: 120,
                description: "Tretton blandade bitar. Kockens val",
                category: "Sushi"
            },
            {
                name: "Extra allt Sushi",
                price: 150,
                description: "Sexton blandade bitar. Kockens val",
                category: "Sushi"
            },
            {
                name: "Lax Sushi",
                price: 129,
                description: "Färsk lax på ris",
                category: "Sushi"
            },
            {
                name: "Maki Mix",
                price: 110,
                description: "Blandade makirullar",
                category: "Sushi"
            },

            {
                name: "Yakisoba",
                price: 119,
                description: "Stekta nudlar med grönsaker",
                category: "Nudlar"
            },
            {
                name: "Pad Thai",
                price: 119,
                description: "Stekta nudlar med kyckling, jordnötter, böngroddar och ägg.",
                category: "Nudlar"
            },
            {
                name: "Miso Ramen",
                price: 119,
                description: "Vegetarisk nudelsoppa med grönsaker och tofu",
                category: "Nudlar"
            },

            {
                name: "Kyckling Teriyaki",
                price: 139,
                description: "Serveras med ris",
                category: "Risrätter"
            },
            {
                name: "Kyckling Röd Curry",
                price: 139,
                description: "Serveras med ris",
                category: "Risrätter"
            },

            {
                name: "Friterad banan",
                price: 59,
                description: "Serveras med glass",
                category: "Desserter"
            },
            {
                name: "Jordgubbar",
                price: 59,
                description: "Serveras med glass",
                category: "Desserter"
            },

            {
                name: "Läsk",
                price: 20,
                description: "Olika sorter. Välj fritt ur vår kyl",
                category: "Drycker"
            },
            {
                name: "Öl",
                price: 75,
                description: "Olika sorter. Välj fritt ur vår kyl",
                category: "Drycker"
            },
        ];

        for (const item of menuItems) {
            const category = categoryIds.find(c => c.name === item.category);

            await client.query(
                `INSERT INTO menu_items
                (name, price, description, is_available, is_offer, category_id)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    item.name,
                    item.price,
                    item.description,
                    true,
                    false,
                    category.id
                ]
            );
        }

        console.log("Menyitems skapade");

    } catch (error) {
        console.error("Insert error:", error);
    } finally {
        await client.end();
    }
}

insert();