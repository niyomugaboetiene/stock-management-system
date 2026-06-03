import express from "express";
import cors from "cors";
import ProductRoute from "./routes/ProductRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/product', ProductRoute);

app.listen(5000, () => {
    console.log("http://localhost:5000");
});