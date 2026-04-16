require("dotenv").config();
var cors = require("cors");
var express = require("express");

const connectToDatabase = require("./database/db.js");
const { connectRedis } = require("./config/redisClient.js");
const { createLimiters } = require("./MiddleWare/rateLimiter.js");

// routes
var useRoutes = require("./Routes/userRoutes");
var productRoutes = require("./Routes/ProductRoutes.js");
var profileRoutes = require("./Routes/profileRoutes.js");
var cartRoutes = require("./Routes/cartRoutes.js");
var paymentRoutes = require("./Routes/paymentRoutes.js");
var orderRoutes = require("./Routes/orderRoutes.js");
var wishlistRoutes = require("./Routes/wishlistRoutes.js")

var app = express();

app.use(cors());
app.use(express.json());



const startServer = async () => {
  //  1. Connect Redis FIRST
  await connectRedis();

  //  2. Create limiters AFTER Redis
  const { productLimiter, adminLimiter } = createLimiters();

  //  3. Apply limiters
  app.use("/", productLimiter, productRoutes);
  app.use("/", adminLimiter); // optional for admin

  // routes
  app.use("/", useRoutes);
  app.use("/", profileRoutes);
  app.use("/", cartRoutes);
  app.use("/", paymentRoutes);
  app.use("/", orderRoutes);
  app.use("/", wishlistRoutes);

  // DB
  await connectToDatabase();

  app.listen(process.env.PORT, () => {
    console.log("The server is running");
  });
};

startServer();