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

        const newStock = await connection.query(
            `INSERT INTO StockTransaction(transactionDate, quantityMoved, transactionType, product_id)
             VALUES(?, ?, ?, ?)
            `, [transactionDate, quantityMoved, transactionType, product_id]
        );

        return res.status(201).json({ message: 'Added successfully', data: newStock.values });
    } catch (err) {
        console.error(err);
    }
});

router.get('/list', async (req, res) => {
    try {
        const [list] = await connection.query(
            `SELECT * FROM StockTransaction`
        );

        return res.status(200).json({ message: 'List', list: list });
    } catch (err) {
        console.error(err);
    }
});

router.get('/list/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [list] = await connection.query(
            `SELECT * FROM StockTransaction WHERE id = ?`, [id]
        );

        return res.status(200).json({ message: 'List', list: list });
    } catch (err) {
        console.error(err);
    }
});


export default router;