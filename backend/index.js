require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const pool = require("./db");
const propertiesRoutes = require("./routes/properties");
const requestLogger = require("./middleware/requestLogger");
const searchRouter = require("./routes/search");

app.use(express.json());
app.use(requestLogger);
app.use("/api/properties", propertiesRoutes);
app.use("/api/search", searchRouter);

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