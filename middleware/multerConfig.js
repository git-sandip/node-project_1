const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const allowedFileTypes = ["image/png", "image/jpg"];
    const comingFileType = file.mimetype;

    if (!allowedFileTypes.includes(comingFileType)) {
      cb(new Error("File type not supported"));
    } else {
      cb(null, "./uploads");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};
