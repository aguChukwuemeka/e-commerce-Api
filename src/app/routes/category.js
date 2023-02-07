import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  checkIfAdmin,
  checkIfTheOwnerOrAdmin,
} from "../middleware/authorization";
import Category from "../models/category";

const router = express.Router();

//CREATE CATEGORY
router.post("/", verifyToken, async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save(); 
    return res.status(200).json({
      status: "success",
      message: "Category created successfully",
      savedCategory,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

//GET USER CATEGORY
router.get(
  "/:userId",
  [verifyToken, checkIfTheOwnerOrAdmin],
  async (req, res) => {
    const query = req.query.new;
    try {
      const category = await User.findOne({ userId: req.params.userId });
      return res.status(200).json({
        status: "success",
        message: category,
      });
    } catch (err) {
      return res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);

//GET ALL CATEGORIES FOR ALL USERS
router.get("/", [verifyToken, checkIfAdmin], async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      status: "success",
      message: categories,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

//UPDATE CATEGORY
router.patch(
  "/:id",
  [verifyToken, checkIfTheOwnerOrAdmin],
  async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json({
        status: "success",
        message: updatedCategory,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  }
);

// DELETE CATEGORY
router.delete(
  "/:id",
  [verifyToken, checkIfTheOwnerOrAdmin],
  async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  }
);

module.exports = router;
