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

        const [stockIn] = await connection.query(
            `SELECT * FROM product WHERE id = ?`, [product_id]
        );
        
        const [stockInSecond] = await connection.query(
            `SELECT * FROM StockTransaction WHERE product_id = ?`, [product_id]
        );

        if (transactionType =='out') {
               const quantity = stockIn[0].quantityInStock;
               const secondQuantity = stockInSecond[0].quantityMoved;
               const total = quantity + secondQuantity;

               if (quantityMoved > total) {
               return res.status(403).json({ message: `Not enough in stock your stock in ${quantity}`})
        }
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

router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const { transactionDate, quantityMoved, transactionType, product_id } = req.body;

        let fields = [];
        let values = [];

        if (transactionDate) {
            fields.push("transactionDate = ?");
            values.push(transactionDate);
        }

        if (quantityMoved) {
            fields.push("quantityMoved = ?");
            values.push(quantityMoved);
        }

        if (transactionType) {
            fields.push("transactionType = ?");
            values.push(transactionType);
        }

        if (product_id) {
            fields.push("product_id = ?");
            values.push(product_id);
        }

        values.push(id);

        const [stockIn] = await connection.query(
            `SELECT * FROM product WHERE id = ?`, [product_id]
        );

       if (transactionType == 'out') {
             const quantity = stockIn[0].quantityInStock;

            if (quantityMoved > quantity) {
               return res.status(403).json({ message: `Not enough in stock your stock in ${quantity}`})
           }
       }

        const sql = `
          UPDATE StockTransaction SET ${fields.join(",")}
          WHERE id = ?
        `;

        await connection.query(sql, values);
        return res.status(200).json({ message: 'Updated successfully' });
    }  catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error'})
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await connection.query(
            `DELETE FROM StockTransaction WHERE id = ?`, [id]
        );

        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// report
router.get('/report/daily', async (req, res) => {
    try {
        const [rows] = await connection.query( `
           SELECT * FROM product p JOIN StockTransaction s on p.id = s.product_id
           WHERE DATE(s.transactionDate) = CURDATE()
        `);

        return res.status(200).json({ message: 'Daily report', report: rows });
    } catch (err) {
        console.error(err);
    }
});

router.get('/report/weeky', async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM product p JOIN StockTransaction s on p.id = s.product_id
             WHERE s.transactionDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            `
        );
        
        return res.status(200).json({ message: 'Weekly report', report: rows });
    } catch (err) {
        console.error(err);
    }
})

router.get('/report/monthly', async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM product p JOIN StockTransaction s on p.id = s.product_id
             WHERE MONTH(s.transactionDate) = MONTH(CURDATE())
             AND YEAR(s.transactionDate) = YEAR(CURDATE())
            `
        );

        return res.status(200).json({ message: 'Monthly report', month: rows });
    } catch (err) {
        console.error(err);
    }
});

router.get('/totals', async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT  FROM StockTransaction`
        );

        return res.status(200).json({ message: 'Totals', total: rows });
    } catch (err) {
        console.error(err);
    }
})
export default router;