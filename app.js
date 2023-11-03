const express = require("express");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");

//database
require("./model/index");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/addBlog", (req, res) => {
  res.render("AddBlog");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server has been started on http://localhost:${port}`);
});
