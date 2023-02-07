import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { checkIfAdmin } from "../middleware/authorization";
import Product from "../models/product";

const router = express.Router();

//CREATE PRODUCT
router.post("/", [verifyToken, checkIfAdmin], async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    return res.status(200).json({
      status: "success",
      message: "Product created successfully",
      savedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({
      status: "success",
      message: "Product found",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Product not found",
      error: err.message,
    });
  }
});

//GET ALL PRODUCTs
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({ category: { $in: [queryCategory] } });
    } else {
      products = await Product.find();
    }
    return res.status(200).json({
      status: "success",
      message: products,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

//UPDATE PRODUCT
router.patch("/:id", [verifyToken, checkIfAdmin], async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

//DELETE PRODUCT
router.delete("/:id", [verifyToken, checkIfAdmin], async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
      message: "Product has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

module.exports = router;
