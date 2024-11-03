import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import Swal from "sweetalert2";
import Navbar from './NavBar'; 

const StudentDashboard = ({ user, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [homework, setHomework] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(response.data);

      const enrolled = response.data.filter((course) => course.students.includes(user.id));
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEnrollClick = (courseId) => {
    setSelectedCourseId(courseId);
    setPaymentOpen(true);
  };

  const handleEnroll = async () => {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; 
    const cvvRegex = /^[0-9]{3}$/;

    if (!cardNumberRegex.test(cardNumber)) {
      setSnackbarMessage("Card number must be 16 digits.");
      setSnackbarOpen(true);
      return;
    }
    
    if (!expiryDateRegex.test(expiryDate)) {
      setSnackbarMessage("Expiry date must be in MM/YY format.");
      setSnackbarOpen(true);
      return;
    }

    if (!cvvRegex.test(cvv)) {
      setSnackbarMessage("CVV must be 3 digits.");
      setSnackbarOpen(true);
      return;
    }

    if (selectedCourseId) {
      try {
        await axios.post("http://localhost:5000/api/courses/enroll", { courseId: selectedCourseId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("Enrolled!", "You've been enrolled in the course.", "success");
        fetchCourses();
        handleClosePayment(); 
      } catch (error) {
        console.error("Error enrolling in course:", error);
      }
    }
  };

  const handleClosePayment = () => {
    setPaymentOpen(false);
    setSelectedCourseId(null);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  const handleHomeworkUpload = async (courseId) => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("homework", homework);

    try {
      await axios.post("http://localhost:5000/api/courses/upload-homework", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("Uploaded!", "Homework uploaded successfully.", "success");
      setHomework(null); 
    } catch (error) {
      console.error("Error uploading homework:", error);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <Container>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Available Courses
        </Typography>
        <List>
          {courses.map((course) => (
            <Card key={course._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Teacher: {course.teacher.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEnrollClick(course._id)}
                >
                  Enroll
                </Button>
              </CardActions>
            </Card>
          ))}
        </List>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" sx={{ mt: 4, fontWeight: 'bold' }}>
          Enrolled Courses
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {enrolledCourses.map((course) => (
            <Card key={course._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <TextField
                  type="file"
                  onChange={(e) => setHomework(e.target.files[0])}
                  inputProps={{ accept: ".pdf, .doc, .docx, .ppt, .pptx, .txt" }} 
                  sx={{ mt: 2 }}
                  fullWidth
                />
              </CardContent>
              <CardActions>
                <IconButton
                  color="secondary"
                  onClick={() => handleHomeworkUpload(course._id)}
                >
                  <UploadIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 1 }}
                  onClick={() => handleHomeworkUpload(course._id)}
                >
                  Upload Homework
                </Button>
              </CardActions>
            </Card>
          ))}
        </List>

        <Dialog open={paymentOpen} onClose={handleClosePayment}>
          <DialogTitle>Payment Confirmation</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Proceed with the payment for the selected course.</Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Card Number"
              type="text"
              fullWidth
              variant="outlined"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              label="Expiry Date (MM/YY)"
              type="text"
              fullWidth
              variant="outlined"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              label="CVV"
              type="text"
              fullWidth
              variant="outlined"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePayment} color="primary">Cancel</Button>
            <Button onClick={handleEnroll} color="primary">Confirm Payment</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </>
  );
};

export default StudentDashboard;
