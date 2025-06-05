// src/Context/BugContext.jsx
import React, { createContext, useState, useContext } from 'react';

const BugContext = createContext();

export function BugProvider({ children }) {
  const [selectedBugId, setSelectedBugId] = useState(null);

  return (
    <BugContext.Provider value={{ selectedBugId, setSelectedBugId }}>
      {children}
    </BugContext.Provider>
  );
}

export function useBugContext() {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugContext must be used within a BugProvider');
  }
  return context;
}
