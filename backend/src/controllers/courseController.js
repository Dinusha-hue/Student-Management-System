const Course = require("../models/Course");
const User = require("../models/User");

exports.addCourse = async (req, res) => {
    const teacherId = req.userId;
    const { name, description } = req.body;
  
    try {
      const newCourse = await Course.create({
        name,
        description,
        teacher: teacherId,
      });
      res.status(201).json({ message: "Course added successfully", course: newCourse });
    } catch (error) {
      res.status(500).json({ message: "Error adding course", error });
    }
};

exports.getCourses = async (req, res) => {
    try {
      const courses = await Course.find().populate("teacher", "name");
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses", error });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      if (!course.students.includes(req.userId)) {
        course.students.push(req.userId);
        await course.save();
      }
  
      res.json({ message: "Enrolled successfully", course });
    } catch (error) {
      res.status(500).json({ message: "Error enrolling in course", error });
    }
};

exports.uploadHomework = async (req, res) => {
    try {
      const { courseId } = req.body;
      const course = await Course.findById(courseId);
  
      if (!course || !course.students.includes(req.userId)) {
        return res.status(404).json({ message: "Course not found or not enrolled" });
      }
  
      course.homework.push({ student: req.userId, file: req.file.path });
      await course.save();
  
      res.json({ message: "Homework uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error uploading homework", error });
    }
};
  
