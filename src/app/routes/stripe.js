import express from "express";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config({ path: "config.env" });
const STRIPE = process.env.STRIPE_SECRET_KEY;

router.post("/payment", (req, res) => {
  STRIPE.charges.create(
    {
      source: req.body.tokenId,
      source: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json({ status: "Failed", error: stripeErr });
      } else {
        res
          .status(200)
          .json({
            status: "Success",
            message: "Payment went successfully",
            stripeRes,
          });
      }
    }
  );
});

module.exports = router;
