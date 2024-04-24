'use client'
// DataProvider.tsx
import React, { createContext, useState, useMemo } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState(null);

  const piecesData = useMemo(() => selectedData?.piecesData ?? [], [selectedData]);
  const data = useMemo(() => selectedData ?? null, [selectedData]);

  return (
    <DataContext.Provider value={{ piecesData, data, setSelectedData }}>
      {children}
    </DataContext.Provider>
  );
};