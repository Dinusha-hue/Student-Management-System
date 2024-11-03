import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import Logo from '../logo.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";

const Navbar = ({ user, onLogout }) => {  
  const [userDetails, setUserDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/get/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const profilePictureURL = response.data.profilePicture
          ? `http://localhost:5000/${response.data.profilePicture.replace(/\\/g, '/')}`
          : null;

        console.log('Profile Picture URL:', profilePictureURL);
        setUserDetails({ ...response.data, profilePicture: profilePictureURL });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user.id]); 

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ width: '100%', backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="Student Management System Logo" style={{ width: '40px', marginRight: '8px' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Student Management System
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Welcome, {user.name}!
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit">
            {userDetails && userDetails.profilePicture ? (
              <Avatar src={userDetails.profilePicture} alt={user.name} />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
