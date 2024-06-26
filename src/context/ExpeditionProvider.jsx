// ExpeditionProvider.tsx
'use client'
import React, { createContext, useState, useMemo } from 'react';

export const ExpeditionContext = createContext();

export const ExpeditionProvider = ({ children }) => {
  const [expeditionData, setExpeditionData] = useState([]);

  const saveData = (data) => {
    setExpeditionData(prevData => [...prevData, data]);
  };

  const removeData = (index) => {
    setExpeditionData(prevData => prevData.filter((_, i) => i !== index));
  };

  const removeMultipleData = (indices) => {
    setExpeditionData(prevData => prevData.filter((_, i) => !indices.includes(i)));
  };

  const value = useMemo(() => ({ expeditionData, saveData, removeData, removeMultipleData }), [expeditionData]);

  return (
    <ExpeditionContext.Provider value={value}>
      {children}
    </ExpeditionContext.Provider>
  );
};
