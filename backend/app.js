const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

//config
dotenv.config({ path: "./config/config.env" });
const cookieparser = require("cookie-parser");
const errorMiddleware = require("./middleware/error.js");
const productRoute = require("./routes/productRoute.js");
const userRoute = require("./routes/userRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const paymentRoute = require("./routes/paymentRoute.js");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json({ limit: "80mb" })); // Increase limit as needed
app.use(express.urlencoded({ limit: "80mb", extended: true })); // Increase limit as needed

app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // If you need to send cookies with requests
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(cookieparser());
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

//error middleware
app.use(errorMiddleware);
module.exports = app;
