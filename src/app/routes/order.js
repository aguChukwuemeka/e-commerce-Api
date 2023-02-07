import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  checkIfAdmin,
  checkIfTheOwnerOrAdmin,
} from "../middleware/authorization";
import Order from "../models/order";

const router = express.Router();

//CREATE ORDER
router.post("/", [verifyToken, checkIfTheOwnerOrAdmin], async (req, res) => {
  const { userId, product, amount, address } = req.body;
  try {
    const newOrder = new Order({
      userId,
      product,
      amount,
      address,
    });
    // console.log(newOrder);
    const savedOrder = await newOrder.save();
    return res.status(200).json({
      status: "success",
      message: savedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

//GET USER ORDER
router.get("/:userId", [checkIfTheOwnerOrAdmin], async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    return res.status(200).json({
      status: "success",
      message: order,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

//GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      status: "success",
      message: orders,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

//UPDATE ORDER
router.patch("/:id", [verifyToken, checkIfAdmin], async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: updatedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

//DELETE ORDER
router.delete("/:id", [verifyToken, checkIfAdmin], async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
      message: "Order has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

//GET MONTHLY INCOME

router.get("/income", [verifyToken, checkIfAdmin], async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const monthlyIncome = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth.getFullYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      monthlyIncome,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

module.exports = router;
