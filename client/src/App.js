import React, { useEffect, useState } from "react";
import BrainstormItem from "./components/BrainstormItem";
import GroupingContainer from "./components/GroupingContainer";
import RoleSelectionModal from "./components/RoleSelectionModal";
import NavBar from "./components/NavBar";

import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null,
  );
  const [remainingVotes, setRemainingVotes] = useState(5); // Starts with 5 votes
  const HARD_CODED_ACCESS_CODE = "MDOK";

  const legendItems = [
    { id: "legend-1", role: 1, comment: "Intern/RMO", votes: "" },
    { id: "legend-2", role: 2, comment: "Registrar/SRMO", votes: "" },
    { id: "legend-3", role: 3, comment: "Consultant", votes: "" },
    { id: "legend-4", role: 4, comment: "Nursing/AH", votes: "" },
    { id: "legend-5", role: 5, comment: "Admin/Non-clinical", votes: "" },
  ];

  // Define fetchData outside useEffect
  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Failed to fetch or parse data:", error);
    }
  };

  useEffect(() => {
    // No need to declare userRole again since it's already in state
    if (!userRole) {
      // Use the state directly
      setRoleModalOpen(true);
    }
    fetchData();
  }, [userRole]); // Depend on userRole to re-evaluate this effect when it changes

  const handleRoleSelected = (accessCode, userRole) => {
    // Check if the entered access code matches the hard-coded one
    if (accessCode === HARD_CODED_ACCESS_CODE) {
      console.log(`UserRole: ${userRole} set with correct access code.`);
      localStorage.setItem("userRole", userRole); // Persist the role
      setUserRole(userRole); // Update state
      setRoleModalOpen(false); // Close the modal upon successful validation
    } else {
      // If the codes do not match, inform the user.
      alert("Incorrect access code. Please try again.");
      // Optionally, you might want to keep the modal open or clear the input for another attempt.
    }
  };

  const handleRoleChange = () => {
    setRoleModalOpen(true);
  };

  const handleVote = async (itemId) => {
    if (remainingVotes <= 0) {
      alert("You have used all your votes.");
      return; // Exit the function early if no votes are remaining
    }
    // Directly use `userRole` from state instead of calling getUserRole()
    console.log(`User with role ${userRole} voted for item ${itemId}`);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `userRole` is used directly from state here
        body: JSON.stringify({ itemId, userRole }),
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }

      const result = await response.json();
      console.log(result.message);
      // Assuming you might want to decrement the remaining votes
      setRemainingVotes((prev) => prev - 1);
      fetchData(); // Reload data to reflect any changes
    } catch (error) {
      console.error("Error handling vote:", error.message);
    }
  };

  // Processing data for groupings
  const { grouped, ungrouped } = data.slice(1).reduce(
    (acc, row) => {
      const [id, role, grouping, comment, votes] = row;
      const item = { id, role, comment, votes: votes || 0 };

      if (grouping) {
        if (!acc.grouped[grouping]) acc.grouped[grouping] = [];
        acc.grouped[grouping].push(item);
      } else {
        acc.ungrouped.push(item);
      }
      return acc;
    },
    { grouped: {}, ungrouped: [] },
  );

  return (
    <>
      <NavBar
        onRoleChange={handleRoleChange}
        remainingVotes={remainingVotes}
        userRole={userRole}
      />
      <RoleSelectionModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onRoleSelected={handleRoleSelected}
      />
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        {legendItems.map((item) => (
          <BrainstormItem
            key={item.id}
            role={item.role}
            comment={item.comment}
            isLegend={true}
          />
        ))}
      </div>
      <div className="app">
        {Object.entries(grouped).map(([groupName, items], index) => (
          <GroupingContainer key={index} groupName={groupName}>
            {items.map((item, itemIndex) => (
              <BrainstormItem
                key={itemIndex}
                id={item.id}
                role={item.role}
                comment={item.comment}
                votes={item.votes}
                onVote={handleVote}
              />
            ))}
          </GroupingContainer>
        ))}
        {ungrouped.map((item, index) => (
          <BrainstormItem
            key={`ungrouped-${index}`}
            id={item.id}
            role={item.role}
            comment={item.comment}
            votes={item.votes}
            onVote={handleVote}
          />
        ))}
      </div>
    </>
  );
}

export default App;
