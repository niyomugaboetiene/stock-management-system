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
        
         const id = req.params.id;

         let fields = []
         let values = []

         if (productCode) {
            fields.push("productCode = ?")
            values.push(productCode)
         }
         
         if (productName) {
            fields.push("productName = ?")
            values.push(productName)
         }
         
         if (category) {
            fields.push("category = ?")
            values.push(category)
         }
         
         if (unitPrice) {
            fields.push("unitPrice = ?")
            values.push(unitPrice)
         }
         
         if (quantityInStock) {
            fields.push("quantityInStock = ?")
            values.push(quantityInStock)
         }
         
         if (supplierName) {
            fields.push("supplierName = ?")
            values.push(supplierName)
         }
         
         if (dateReceived) {
            fields.push("dateReceived = ?")
            values.push(dateReceived)
         }
         
         if (warehouse_id) {
            fields.push("warehouse_id = ?")
            values.push(warehouse_id)
         }
         values.push(id);

        const sql = `
           UPDATE product SET ${fields.join(",")}
           WHERE id = ?
        `;

         await connection.query(sql, values);
         return res.status(200).json({ message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
    }
});

export default router;