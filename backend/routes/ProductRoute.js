import connection from "../config/conn.js";
import express from "express";

const router = express.Router();

router.post('/addNew', async (req, res) => {
    try {
        // productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived
        const {  productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived, warehouse_id } = req.body;

        if (!productCode || !productName || !category || !quantityInStock || !unitPrice || !supplierName) {
            return res.status(400).json({ message: 'Fill out missing fields' });
        }

        const newProduct = await connection.query(
            `INSERT INTO
             product(productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived, warehouse_id)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?)
             `, [productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived, warehouse_id]
        );

        return res.status(201).json({ message: 'Added successfully', new: newProduct });
    } catch (err) {
        console.error(err);
    }
});

router.get('/list', async (req, res) => {
    try {
        const [list] = await connection.query(
            'SELECT * FROM product'
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
            `SELECT * FROM product WHERE id = ?`, [id]
        );

        if (list.length === 0) {
            return res.status(404).json({ message: 'Not found' });
        }

            return res.status(200).json({ message: 'List', list: list });
    } catch (err) {
        console.error(err);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
         const {  productCode, productName, category, quantityInStock, unitPrice,supplierName, dateReceived, warehouse_id } = req.body;

         let updatedFiled = [];
         const id = req.params.id;

         if (productCode) updatedFiled.push(productCode);
         if (productName) updatedFiled.push(productName);
         if (quantityInStock) updatedFiled.push(quantityInStock);
         if (category) updatedFiled.push(category);
         if (unitPrice) updatedFiled.push(unitPrice);
         if (supplierName) updatedFiled.push(supplierName);
         if (dateReceived) updatedFiled.push(dateReceived);
         if (warehouse_id) updatedFiled.push(warehouse_id);


         await connection.query(
                `UPDATE product SET productCode = ?, productName = ?, category = ?, quantityInStock = ?, unitPrice = ?
                 supplierName = ?, dateReceived = ?, warehouse_id = ? WHERE id = ?
                `, [updatedFiled, id]
         );

         return res.status(200).json({ message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
    }
});

export default router;