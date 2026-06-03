import express from "express";
import cors from "cors";
import ProductRoute from "./routes/ProductRoute.js";
import WarehouseRoute from "./routes/WarehouseRoute.js";
import StockTransaction from "./routes/StockTransaction.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/product', ProductRoute);
app.use('/warehouse', WarehouseRoute);
app.use('/stock', StockTransaction);

app.listen(5000, () => {
    console.log("http://localhost:5000");
});