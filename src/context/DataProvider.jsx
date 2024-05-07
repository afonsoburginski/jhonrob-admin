'use client'
// DataProvider.tsx
import React, { createContext, useState, useMemo } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState(null);

  const documentData = useMemo(() => selectedData?.documentData ?? null, [selectedData]);

  return (
    <DataContext.Provider value={{ documentData, setSelectedData }}>
      {children}
    </DataContext.Provider>
  );
};