const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../frontend/public/images/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype == "image/png") {
      callback(null, true);
    } else {
      console.log("erreur de format du fichier");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 70,
  },
});

module.exports = upload;
