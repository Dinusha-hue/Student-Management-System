import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  TextField,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar'; 

const TeacherDashboard = ({ user, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const teacherCourses = response.data.filter(course => course.teacher._id === user.id );
      console.log(teacherCourses);
      setCourses(teacherCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (event) => {
    setCourseData({ ...courseData, [event.target.name]: event.target.value });
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/courses/add", {
        ...courseData,
        teacher: user._id, 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses((prevCourses) => [...prevCourses, response.data.course]);
      setCourseData({ name: "", description: "" }); 
      Swal.fire("Course Added!", "Your course has been added successfully.", "success");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <>
     <Navbar user={user} onLogout={onLogout} />
      <Container>
       
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4">Add New Course</Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Course Name"
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Box>

        <Typography variant="h4">Your Courses</Typography>
        <List>
          {courses.map((course) => (
            <Paper elevation={3} sx={{ p: 2, mb: 2 }} key={course._id}>
              <ListItem>
                <Typography variant="h6">{course.name}</Typography>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Container>
    </>
  );
};

export default TeacherDashboard;
