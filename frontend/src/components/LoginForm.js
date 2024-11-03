import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from '../logo.png';

const LoginForm = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      Swal.fire({
        title: "Login Successful",
        text: "You have successfully logged in!",
        icon: "success",
      });

      if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);

      Swal.fire({
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
        icon: "error",
      });
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
          Login
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'gray' }}>
          Welcome back! Please enter your credentials to access your account.
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            fontWeight: 'bold',
            mt: 2,
            "&:hover": {
              backgroundColor: "#003f8e",
            },
          }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;
