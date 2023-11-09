const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 10000;

app.use(cors());
const members = {
    1: "Anna",
    2: "Saim",
    3:"Baki"
};

// GET request to get all the members in the database

app.get("/", (req, res) => {
  res.send(members);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});