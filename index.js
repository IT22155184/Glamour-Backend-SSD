import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import itemsRoute from "./routes/itemsRoute.js";
import cartRoute from "./routes/cartRoute.js";
import cusItemsRoute from "./routes/cusItemsRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import deliveryInfoRoute from './routes/deliveryInfoRoute.js';
import orderRoute from './routes/orderRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import bodyMeasurementRoute from './routes/bodyMeasurementRoute.js';
import usersRoute from './routes/usersRoute.js';
import authRoute from './routes/auth.js';
import empRoute from './routes/empRoute.js';
import empAuthRoute from './routes/empAuth.js';


const app = express();
dotenv.config();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Connection Successful!");
});


app.use("/items", itemsRoute);
app.use("/cart", cartRoute);
app.use("/cusItems", cusItemsRoute);
app.use("/reviews", reviewRoute);
app.use("/deliveryInfo", deliveryInfoRoute);
app.use("/orders", orderRoute);
app.use("/payment", paymentRoute);
app.use('/measurements', bodyMeasurementRoute);
app.use('/users', usersRoute);
app.use('/login', authRoute);
app.use('/emps', empRoute);
app.use('/empLogin', empAuthRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });