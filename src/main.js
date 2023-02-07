import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthRoute from "./app/routes/auth";
import UserRoute from "./app/routes/user";
import ProductRoute from "./app/routes/product";
import CategoryRoute from "./app/routes/category";
import OrderRoute from "./app/routes/order";

const app = express();
app.use(express.json());
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_API_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("MONGO_DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/product", ProductRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/order", OrderRoute);

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
