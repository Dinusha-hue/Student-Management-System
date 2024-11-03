const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const userController = require("../controllers/userController");
const multer = require("multer");
const auth = require('../middlewares/authMidddleware');
const upload = multer({ dest: "uploads/" }); 

router.post("/register", upload.single("profilePicture"), userController.registerUser);

router.post("/login", userController.login);

router.get('/get/:id',auth, userController.getUserById);

router.get('/students', auth, async (req, res) => {
    if (req.userRole !== 'teacher') return res.status(403).json({ message: 'Access denied' });
  
    const students = await User.find({ role: 'student' });
    res.json(students);
  });

router.get('/courses', auth, async (req, res) => {
  if (req.userRole !== 'student') return res.status(403).json({ message: 'Access denied' });

  const courses = await Course.find(); 
  res.json(courses);
});

module.exports = router;
