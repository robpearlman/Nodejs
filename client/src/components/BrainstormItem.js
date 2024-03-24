import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// Mapping of roles to their corresponding colors
const roleColors = {
  3: "lightblue", // Consultant
  2: "lightgreen", // Registrar/SRMO
  1: "yellow", // Intern/RMO
  5: "pink", // Admin/Non-clinical
  4: "orange", // Nursing/AH
};

function BrainstormItem({
  id,
  role,
  grouping,
  comment,
  votes,
  onVote,
  isLegend = false,
}) {
  const [votesDialogOpen, setVotesDialogOpen] = useState(false);
  const backgroundColor = roleColors[role] || "grey";
  const voteCounts = JSON.parse(votes || "{}");
  const totalVotes = Object.values(voteCounts).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  const rolesMapping = {
    1: "Intern/RMO",
    2: "Registrar/SRMO",
    3: "Consultant",
    4: "Nursing/AH",
    5: "Admin/Non-clinical",
  };

  // Handler for opening the votes breakdown dialog
  const handleOpenVotesBreakdown = () => {
    if (totalVotes > 0) {
      setVotesDialogOpen(true);
    }
  };
  const handleCloseVotesDialog = () => setVotesDialogOpen(false);

  return (
    <Card sx={{ padding: 2, height: "fit-content", backgroundColor }}>
      <CardContent>
        <Typography variant="body2" component="p">
          {comment}
        </Typography>

        {!isLegend && (
          <>
            <Typography variant="body2" component="p" sx={{ mt: 1 }}>
              Votes: {totalVotes}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => onVote(id)}
              sx={{ mt: 1 }}
            >
              Vote
            </Button>
          </>
        )}
        {/* Conditionally render the button to see votes breakdown */}
        {totalVotes > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenVotesBreakdown}
            sx={{ mt: 1 }}
          >
            Vote Breakdown
          </Button>
        )}

        {/* Votes Breakdown Dialog */}
        <Dialog open={votesDialogOpen} onClose={handleCloseVotesDialog}>
          <DialogTitle>Votes Breakdown</DialogTitle>
          <DialogContent>
            <List>
              {Object.entries(voteCounts).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={`${rolesMapping[key]}: ${value}`} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default BrainstormItem;
