import React, { createContext, useState, useMemo } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState(null);
  const [shipmentData, setShipmentData] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null); // Adicionado

  const documentData = useMemo(() => selectedData?.documentData ?? null, [selectedData]);

  return (
    <DataContext.Provider 
      value={{ 
        documentData, 
        setSelectedData, 
        shipmentData, 
        setShipmentData,
        selectedDocument, // Adicionado
        setSelectedDocument // Adicionado
      }}>
      {children}
    </DataContext.Provider>
  );
};
