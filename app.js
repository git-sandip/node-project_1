const express = require("express");
const { blogs } = require("./model/index");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");

// database
require("./model/index");

//use requested data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/addBlog", (req, res) => {
  res.render("AddBlog");
});
app.get("/about", (req, res) => {
  res.render("About");
});
app.post("/createBlog", async (req, res) => {
  await blogs.create({
    title: req.body.title,
    description: req.body.description,
  });
  res.send({
    status: 200,
    msg: "Blog Created",
    title: req.body.title,
    description: req.body.description,
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server has been started on http://localhost:${port}`);
});
