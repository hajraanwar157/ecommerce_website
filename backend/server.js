const app = require("./app.js");
const dotenv = require("dotenv");
//config
dotenv.config({ path: "./config/config.env" });
const db = require("./config/databaseConnection.js");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port http://localhost: ${process.env.PORT}`
  );
});
//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
