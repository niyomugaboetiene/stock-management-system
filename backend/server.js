import express from "express";
import cors from "cors";
import ProductRoute from "./routes/ProductRoute.js";
import WarehouseRoute from "./routes/WarehouseRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/product', ProductRoute);
app.use('/warehouse', WarehouseRoute);

app.listen(5000, () => {
    console.log("http://localhost:5000");
});