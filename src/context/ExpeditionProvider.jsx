'use client'
import React, { createContext, useState, useMemo } from 'react';

export const ExpeditionContext = createContext();

export const ExpeditionProvider = ({ children }) => {
  const [expeditionData, setExpeditionData] = useState([]);

  const saveData = (data) => {
    setExpeditionData(prevData => [...prevData, data]);
  };

  const value = useMemo(() => ({ expeditionData, saveData }), [expeditionData]);

  return (
    <ExpeditionContext.Provider value={value}>
      {children}
    </ExpeditionContext.Provider>
  );
};