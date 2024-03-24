// NavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Logo from './logo.png'; // Adjust the path to your logo

function NavBar({ onRoleChange, remainingVotes, userRole }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" flexGrow={1} alignItems="center">
          <img src={Logo} alt="Logo" style={{ marginRight: 10, height: 50 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            MedApps MDOK Brainstorm
          </Typography>
        </Box>
        <Typography variant="subtitle1" component="div" sx={{ marginRight: 2 }}>
          Remaining Votes: {remainingVotes}
        </Typography>
        <Button color="inherit" onClick={onRoleChange}>
          Role: {userRole || "Select Role"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
