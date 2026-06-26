require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const pool = require("./db");
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ status: "ok", database: "connected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", database: "disconnected" });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});