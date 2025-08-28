import exprress from "express";
import { Item } from "../models/itemsModel.js";
import { Order } from "../models/orderModel.js";

const router = exprress.Router();

//get items by newandtrending
router.get("/trending", async (request, response) => {
  try {
    const items = await Item.find({ trending: true });

    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const itemsWithPriceChanged = await Promise.all(
      items.map(async (item) => {
        const sales = await Order.aggregate([
          { $unwind: "$products" },
          {
            $match: {
              "products.productId": item.productId,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: "$products.productId",
              totalQuantity: { $sum: "$products.quantity" },
            },
          },
        ]);

        const totalQuantity = sales.length > 0 ? sales[0].totalQuantity : 0;
        const priceChanged =
          item.priceincrease * (totalQuantity / item.salesdifference);
        const price = item.minprice + priceChanged;
        if (price > item.maxprice) {
          item.minprice = item.maxprice;
        } else {
          item.minprice = price;
        }
        return item;
      })
    );

    return response.status(200).json(itemsWithPriceChanged);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get items
router.get("/", async (request, response) => {
  try {
    const items = await Item.find({});

    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const itemsWithPriceChanged = await Promise.all(
      items.map(async (item) => {
        const sales = await Order.aggregate([
          { $unwind: "$products" },
          {
            $match: {
              "products.productId": item.productId,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: "$products.productId",
              totalQuantity: { $sum: "$products.quantity" },
            },
          },
        ]);

        const totalQuantity = sales.length > 0 ? sales[0].totalQuantity : 0;
        const priceChanged =
          item.priceincrease * (totalQuantity / item.salesdifference);
        const price = item.minprice + priceChanged;
        if (price > item.maxprice) {
          item.minprice = item.maxprice;
        } else {
          item.minprice = price;
        }
        return item;
      })
    );

    return response.status(200).json(itemsWithPriceChanged);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get item by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const items = await Item.findById(id);

    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const sales = await Order.aggregate([
      { $unwind: "$products" },
      {
        $match: {
          "products.productId": items.productId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$products.productId",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
    ]);

    const totalQuantity = sales.length > 0 ? sales[0].totalQuantity : 0;
    const priceChanged =
      items.priceincrease * (totalQuantity / items.salesdifference);
    const price = items.minprice + priceChanged;
    if (price > items.maxprice) {
      items.minprice = items.maxprice;
    }
    items.minprice = price;

    return response.status(200).json(items);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
