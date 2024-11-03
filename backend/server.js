const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const courseRoutes = require("./src/routes/courseRoutes");
const userRoutes = require("./src/routes/userRoutes");

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dinushaweerasekara312:O9XdAVMEkgsXMjkt@school-db.qs8x7.mongodb.net/?retryWrites=true&w=majority&appName=School-db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
