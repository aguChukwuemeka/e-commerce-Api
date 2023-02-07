import express from "express";
import CryptoJs from "crypto-js";
import { verifyToken } from "../middleware/verifyToken";
import {
  checkIfAdmin,
  checkIfTheOwnerOrAdmin,
} from "../middleware/authorization";
import User from "../models/user";

const router = express.Router();

// GET USER
router.get("/", [verifyToken, checkIfAdmin], async (req, res) => {
  const query = req.query.new;
  try {
    const user = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// GET INDIVIDUAL USER
router.get("/:id", [verifyToken, checkIfAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// UPDATE
router.put("/:id", [verifyToken, checkIfTheOwnerOrAdmin], async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.JWT_SECRET_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
        },
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// STATS
router.get("/stats", [verifyToken, checkIfAdmin], async (req, res) => {
  const date = new Date.now();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const stats = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      {
        $group: {
          _month: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err });
  }
});

// DELETE
router.delete("/:id", checkIfAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
