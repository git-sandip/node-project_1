const express = require("express");
const { blogs } = require("./model/index");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");
// database
require("./model/index");
//multer
const { multer, storage } = require("./middleware/multerConfig");
const upload = multer({ storage: storage });
//use requested data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", async (req, res) => {
  const allBlogs = await blogs.findAll();
  console.log("🚀 ~ file: app.js:21 ~ app.get ~ allBlogs:", allBlogs);
  res.render("index", { blogs: allBlogs });
});
app.get("/addBlog", (req, res) => {
  res.render("AddBlog");
});
app.get("/about", (req, res) => {
  res.render("About");
});
app.post("/createBlog", upload.single("image"), async (req, res) => {
  const { title, description, subtitle } = req.body;
  const imageName = req.file.filename;

  await blogs.create({
    title,
    description,
    imageName,
    subtitle,
  });
  res.send({
    status: 200,
    msg: "Blog Created",
    title,
    description,
    imageName,
    subtitle,
  });
});

//static files acessing
app.use(express.static("uploads/"));
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server has been started on http://localhost:${port}`);
});
