const express = require("express");
const { blogs } = require("./model/index");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");
const fs = require("fs");
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
    imageName: process.env.BACKEND_URL + imageName,
    subtitle,
  });
  // res.send({
  //   status: 200,
  //   msg: "Blog Created",
  //   title,
  //   description,
  //   imageName,
  //   subtitle,
  // });
  res.redirect("/");
});

//getting single blog
app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const Blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("SingleBlog", { Blog: Blog });
});

//deleting the blog
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const oldData = await blogs.findAll({
    where: {
      id: id,
    },
  });
  const oldFileName = oldData[0].imageName;
  const lengthtocut = process.env.BACKEND_URL.length;
  const filenameAftercut = oldFileName.slice(lengthtocut);
  fs.unlink("./uploads/" + filenameAftercut, (err) => {
    if (err) {
      console.log("error occured", err);
    } else {
      console.log("Old File Deleted successfully");
    }
  });
  blogs.destroy({
    where: {
      id: id,
    },
  });

  res.redirect("/");
});
//editing the blog
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const Blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("EditBlog", { Blog: Blog });
});

//handeling the edited data using post method;
app.post("/editBlog/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, description, subtitle } = req.body;
  let imageName;
  if (req.file) {
    imageName = req.file.filename;
    console.log("🚀 ~ file: app.js:90 ~ app.post ~ imageName:", imageName);
  }
  const oldData = await blogs.findAll({
    where: {
      id: id,
    },
  });
  const oldFileName = oldData[0].imageName;
  const lengthtocut = process.env.BACKEND_URL.length;
  const filenameAftercut = oldFileName.slice(lengthtocut);

  if (imageName) {
    fs.unlink("./uploads/" + filenameAftercut, (err) => {
      if (err) {
        console.log("error occured", err);
      } else {
        console.log("Old File Deleted successfully");
      }
    });
  }

  await blogs.update(
    {
      title,
      description,
      imageName: imageName ? process.env.BACKEND_URL + imageName : oldFileName,
      subtitle,
    },
    {
      where: {
        id: id,
      },
    }
  );
  // res.send({
  //   status: 200,
  //   msg: "Blog Created",
  //   title,
  //   description,
  //   imageName,
  //   subtitle,
  // });
  res.redirect("/blog/" + id);
});

//static files acessing
app.use(express.static("uploads/"));
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server has been started on http://localhost:${port}`);
});
