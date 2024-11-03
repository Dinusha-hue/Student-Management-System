import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Box } from "@mui/material";
import Logo from '../logo.png';

const HomePage = () => {
  const navigate = useNavigate();

const handleLogin = () => {
  navigate("/login");
};

const handleRegister = () => {
  navigate("/register");
};
  return (
    <Container
      component="main" 
      maxWidth="xs"
      sx={{
        mt: 8,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
       <Box sx={{ textAlign: "center", mb: 4 }}>
       <img src={Logo} alt="Student Management System Logo" style={{ width: '100px', marginBottom: '16px' }} />
        <Typography variant="h3" gutterBottom>
          Welcome to Student Management System
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Manage your courses and students efficiently!
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mb: 2, width: '200px', "&:hover": { backgroundColor: "#003f8e" } }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRegister}
          sx={{ width: '200px', "&:hover": { borderColor: "#ff4081" } }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
