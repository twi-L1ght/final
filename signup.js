import cors from "cors";
import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mt_accounts"
});

db.connect(err => {
    if (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL");
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).send("Incorrect password");
        }

        res.send("success");
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});