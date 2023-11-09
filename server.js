const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 10000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello from the server!</h1>");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});