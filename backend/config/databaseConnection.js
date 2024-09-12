const mongoose = require("mongoose");
const mongourl = process.env.DB_URL;
//const mongourl = process.env.DB_URL;
mongoose.connect(mongourl);
const db = mongoose.connection;
//event listeners for database connection
db.on("connected", () => {
  console.log("database connected");
});
// db.on("error", () => {
//   console.log("some error occured while connecting to database");
// });
db.on("disconnected", () => {
  console.log("database not connected");
});
module.exports = db;
