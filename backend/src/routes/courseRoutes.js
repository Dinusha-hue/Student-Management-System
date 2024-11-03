const express = require("express");
const { addCourse, getCourses, enrollCourse, uploadHomework } = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMidddleware");
const multer = require("multer"); 

const router = express.Router();

const upload = multer({ dest: "uploads/homework/" });

router.post("/add", authMiddleware, addCourse);
router.get("/get", authMiddleware, getCourses);
router.post("/enroll", authMiddleware, enrollCourse);
router.post("/upload-homework", authMiddleware, upload.single("homework"), uploadHomework);

module.exports = router;
