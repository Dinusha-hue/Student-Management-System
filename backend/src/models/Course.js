const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  homework: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, file: String }]
});

module.exports = mongoose.model("Course", courseSchema);
