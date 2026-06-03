import express from "express";
import connection from "../config/conn.js";

const router = express.Router();

router.post('/addNew', async (req, res) => {
    try {
        // 	transactionDate	quantityMoved	transactionType	product_id
        const { transactionDate, quantityMoved, transactionType, product_id } = req.body;

        if (!transactionDate || !quantityMoved || !transactionType || !product_id) {
            return res.status(400).json({ message: 'Fill out missing fields' });
        }
    }
})