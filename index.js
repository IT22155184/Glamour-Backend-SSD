import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import itemsRoute from "./routes/items.route.js";
import cartRoute from "./routes/cart.route.js";
import cusItemsRoute from "./routes/cusItems.route.js";
import reviewRoute from "./routes/review.route.js";
import deliveryInfoRoute from './routes/deliveryInfo.route.js';
import orderRoute from './routes/order.route.js';
import paymentRoute from './routes/payment.route.js';
import bodyMeasurementRoute from './routes/bodyMeasurement.route.js';
import usersRoute from './routes/users.route.js';
import authRoute from './routes/auth.route.js';

const app = express();
dotenv.config();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cors());

app.use("/items", itemsRoute);
app.use("/cart", cartRoute);
app.use("/cusItems", cusItemsRoute);
app.use("/reviews", reviewRoute);
app.use("/deliveryInfo", deliveryInfoRoute);
app.use("/orders", orderRoute);
app.use("/payment", paymentRoute);
app.use('/measurements', bodyMeasurementRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log('Port value:', PORT, typeof PORT);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });