import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Snackbar, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from '../logo.png';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 12) {
      return "Password must be 8-12 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must include at least one number.";
    }
    if (!/[@$!%*?&]/.test(password)) {
      return "Password must include at least one special character.";
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(formData.email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarOpen(true);
      return;
    }

    const passwordValidationResult = validatePassword(formData.password);
    if (passwordValidationResult !== true) {
      setSnackbarMessage(passwordValidationResult);
      setSnackbarOpen(true);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully registered. Please log in to the system.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login"); 
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{
      mt: 8,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <img src={Logo} alt="Student Management System Logo" style={{ width: '80px', marginBottom: '16px' }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Register
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'gray' }}>
          Create an account to get started!
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Role"
          name="role"
          onChange={handleChange}
          fullWidth
          select
          sx={{ mb: 2 }}
          value={formData.role}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
        </TextField>
        <Button variant="contained" component="label" sx={{
          mb: 2, 
          width: "100%",
          backgroundColor: "#1976d2",
          "&:hover": { backgroundColor: "#115293" }
        }}>
          Upload Profile Picture
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{
          fontWeight: 'bold',
          mt: 2,
          "&:hover": { backgroundColor: "#003f8e" }
        }}>
          Register
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default RegisterForm;
