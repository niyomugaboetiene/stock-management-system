import connection from "../config/conn.js";
import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(403).json({ message: 'Fill out missing' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.query(
            `INSERT INTO user(username, password) VALUES(?, ?)`[username, hashedPassword]
        );

        return res.status(201).json({ message: 'New user created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});