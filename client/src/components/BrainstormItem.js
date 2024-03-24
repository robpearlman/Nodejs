import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

// Mapping of roles to their corresponding colors
const roleColors = {
  3: "lightblue", // Consultant
  2: "lightgreen", // Registrar/SRMO
  1: "yellow", // Intern/RMO
  5: "pink", // Admin/Non-clinical
  4: "orange", // Nursing/AH
};

function BrainstormItem({ id, role, grouping, comment, votes, onVote }) {
  const backgroundColor = roleColors[role] || "grey";

  return (
    <Card sx={{ padding: 2, height: 'fit-content', backgroundColor }}>
      <CardContent>
        {grouping && (
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Grouping: {grouping}
          </Typography>
        )}
        <Typography variant="body2" component="p">
          {comment}
        </Typography>
        <Typography variant="body2" component="p" sx={{ mt: 1 }}>
          Votes: {votes}
        </Typography>
        <Button variant="contained" size="small" onClick={() => onVote(id)} sx={{ mt: 1 }}>
          Vote
        </Button>
      </CardContent>
    </Card>
  );
}

export default BrainstormItem;
