const express = require("express");
const router = express.Router();
const poste = require("../controllers/poste");
const auth = require("../middleware/auth");

const upload = require("../middleware/multer-config");

router.post("/newpost", auth, upload.single("image"), poste.newPost);
router.post("/getPostSelected", auth, poste.getPostSelected);
router.get("/getpost", poste.getAllPost);
router.delete("/deletepost:id", poste.deleteposte);
router.put("/modifier_post/:id", poste.update);
router.put("/like/:id", poste.postlike);
router.post("/upload", auth, upload.single("image"), poste.upload2);
router.post("/updateComment/:id", auth, poste.updateCommentaire);
router.delete("/deleteComment/:id", poste.deleteCommentaire);

module.exports = router;
