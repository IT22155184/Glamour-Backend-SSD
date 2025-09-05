import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import helmet from 'helmet';
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
import { sanitizeInput } from './middleware/xss.middleware.js';

const app = express();
dotenv.config();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(sanitizeInput);

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