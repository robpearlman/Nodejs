import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, Select, FormControl, InputLabel } from '@mui/material';

const roles = [
  { key: 1, role: 'Intern/RMO', color: 'Yellow' },
  { key: 2, role: 'Registrar/SRMO', color: 'Light Green' },
  { key: 3, role: 'Consultant', color: 'Light Blue' },
  { key: 4, role: 'Nursing/AH', color: 'Orange' },
  { key: 5, role: 'Admin/Non-clinical', color: 'Pink' },
];

function RoleSelectionModal({ open, onRoleSelected }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleAccessCodeChange = (event) => {
    setAccessCode(event.target.value);
  };

  const handleSubmit = () => {
    if (accessCode && selectedRole) {
      onRoleSelected(accessCode, selectedRole);
    }
  };

  const isSubmitDisabled = !accessCode || !selectedRole;

  return (
    <Dialog open={open} onClose={() => {}} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Please enter your access code and select your role</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="access-code"
          label="Please enter your access code:"
          type="text"
          fullWidth
          value={accessCode}
          onChange={handleAccessCodeChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-select-label">Please select your role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            {roles.map((option) => (
              <MenuItem key={option.key} value={option.key}>{option.role}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={isSubmitDisabled} 
          style={{ marginTop: 20 }}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default RoleSelectionModal;
