import React, { useEffect, useState } from "react";
import BrainstormItem from "./components/BrainstormItem";
import GroupingContainer from "./components/GroupingContainer";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json(); // Directly expecting JSON
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch or parse data:", error);
      }
    }
    fetchData();
  }, []);

  // LocalStorage functions for userRole
  const setUserRole = (role) => {
    localStorage.setItem("userRole", role);
  };

  const getUserRole = () => {
    return localStorage.getItem("userRole") || "defaultRole";
  };

  const handleVote = async (itemId) => {
    const userRole = getUserRole();
    console.log(`User with role ${userRole} voted for item ${itemId}`);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, userRole }),
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }

      const result = await response.json();
      console.log(result.message);
      // Update state or UI here as needed
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
  );
}

export default App;
