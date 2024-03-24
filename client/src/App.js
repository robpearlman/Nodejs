import React, { useEffect, useState } from "react";
import BrainstormItem from "./components/BrainstormItem";
import './App.css'; // Adjust the path as necessary based on your project structure
import GroupingContainer from "./components/GroupingContainer";

function App() {
  const [data, setData] = useState([]);
  //const dataRows = data.slice(1); // This removes the first row (headers)
  const setUserRole = (role) => {
    localStorage.setItem('userRole', role);
  };

  const getUserRole = () => {
    return localStorage.getItem('userRole') || 'defaultRole';
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data"); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text(); // Use text() to read the response stream
        const jsonData = text ? JSON.parse(text) : {};
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch or parse data:", error);
      }
    }

    fetchData();
  }, []);
    // Organize items into groups and ungrouped
    const { grouped, ungrouped } = data.slice(1).reduce((acc, row) => {
      // Assuming the structure is [id, role, grouping, comment, votes]
      const [id, role, grouping, comment, votes] = row;
      const item = { id, role, comment, votes: votes || 0 };

      if (grouping) {
        if (!acc.grouped[grouping]) acc.grouped[grouping] = [];
        acc.grouped[grouping].push(item);
      } else {
        acc.ungrouped.push(item);
      }
      return acc;
    }, { grouped: {}, ungrouped: [] });

      const handleVote = async (itemId) => {
        const userRole = getUserRole(); // Retrieve the user role from localStorage
        console.log(`User with role ${userRole} voted for item ${itemId}`);
        try {
          const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, userRole }), // Send both itemId and userRole in the request body
          });

          if (!response.ok) {
            throw new Error('Vote failed');
          }

          const result = await response.json();
          console.log(result.message);

          // Here, you'd update the state to reflect the new vote count.
          // For simplicity, you might re-fetch the data or update the item's vote count directly in state.
        } catch (error) {
          console.error("Error handling vote:", error.message);
        }
      };

return (
  <div className="app">
    {Object.entries(grouped).map(([groupName, items], index) => (
      <GroupingContainer key={index} groupName={groupName}>
        {items.map((item, itemIndex) => (
          <BrainstormItem
            key={itemIndex}
            id={item.id} // Ensure each item has a unique identifier
            role={item.role} // Used for determining the item's color
            comment={item.comment}
            votes={item.votes} // Pass the votes count
            onVote={handleVote} // Pass the voting handler
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

export default App;
