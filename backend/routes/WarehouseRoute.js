import connection from "../config/conn.js";
import express from "express";

const router = express.Router();

router.post('/addNew', async (req, res) => {
    try {
        // id	warehouseCode	warehouseName	warehouseLocation
        const {  warehouseCode, warehouseName, warehouseLocation } = req.body;

        if (!warehouseCode || !warehouseName || !warehouseLocation) {
            return res.status(400).json({ message: 'Fill out missing fields' });
        }

        const newWarehouse = await connection.query(
            `INSERT INTO
             Warehouse(warehouseCode, warehouseName, warehouseLocation)
             VALUES(?, ?, ?)
             `, [warehouseCode, warehouseName, warehouseLocation]
        );

        return res.status(201).json({ message: 'Added successfully', new: newWarehouse });
    } catch (err) {
        console.error(err);
    }
});

export default router;