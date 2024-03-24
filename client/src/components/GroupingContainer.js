import React from 'react';
import { Card, Typography } from '@mui/material';

function GroupingContainer({ groupName, children }) {
  return (
    <Card sx={{
      border: '1px solid black',
      borderRadius: '10px',
      margin: '20px',
      padding: '10px',
      backgroundColor: 'white',
      minWidth: '280px', // Ensure a minimum width for the container
      maxWidth: '100%', // Ensure it doesn't exceed the width of its parent container
    }}>
      <Typography variant="h6" sx={{ 
        textAlign: 'center',
        position: 'relative',
        background: 'white',
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {groupName}
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {children}
      </div>
    </Card>
  );
}

export default GroupingContainer;
