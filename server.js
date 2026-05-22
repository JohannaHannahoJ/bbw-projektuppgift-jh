const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Starta expressapplikationen
const app = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(cors());

// Routes
const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// starta applikationen
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});