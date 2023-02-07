import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    product: [
      {
        userId: { type: String, required: true },
        product: [
          {
            productId: {
              type: String,
            },
            quantity: { type: Number, default: 1 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
