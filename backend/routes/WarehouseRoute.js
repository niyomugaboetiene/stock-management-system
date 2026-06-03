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

router.get('/list', async (req, res) => {
    try {
        const [list] = await connection.query(
            `SELECT * FROM Warehouse`
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
            `SELECT * FROM Warehouse WHERE id = ?`, [id]
        );

        return res.status(200).json({ message: 'List', list: list });
    } catch (err) {
        console.error(err);
    }
});


router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {warehouseCode, warehouseName, warehouseLocation} = req.body;

        let fields = []
        let values = []
        if (warehouseCode) {
            fields.push("warehouseCode = ?")
            values.push(warehouseCode);
        }
        
        if (warehouseName) {
            fields.push("warehouseName = ?")
            values.push(warehouseName);
        }
        
        if (warehouseLocation) {
            fields.push("warehouseLocation = ?")
            values.push(warehouseLocation);
        }

        values.push(id);

        let sql = `
          UPDATE Warehouse SET ${fields.join(",")}
          WHERE id = ?
        `;
        
        await connection.query(sql, values);

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await connection.query(
            `DELETE FROM Warehouse WHERE id = ?`, [id]
        );

        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
    }
});
export default router;