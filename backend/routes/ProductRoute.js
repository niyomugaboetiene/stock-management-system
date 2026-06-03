import connection from "../config/conn.js";
import express from "express";

const router = express.Router();

router.post('/addNew', async (req, res) => {
    try {
        // productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived
        const {  productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived } = req.body;

        if (!productCode || productName || !category || !quantityInStock || !unitPrice || !supplierName || !dateReceived) {
            return res.status(400).json({ message: 'Fill out missing fields' });
        }

        const newProduct = await connection.query(
            `INSERT INTO
             product(productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived)
             VALUES(?, ?, ?, ?, ?, ?, ?)
             `, [productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived]
        );

        return res.status(201).json({ message: 'Added successfully', new: newProduct });
    } catch (err) {
        console.error(err);
    }
});