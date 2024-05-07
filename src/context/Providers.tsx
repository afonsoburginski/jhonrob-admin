// Providers.tsx
'use client'
import React from 'react';
import { DataProvider } from './DataProvider';
import { ThemeProvider } from './ThemeProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

// Crie uma instância do QueryClient
const queryClient = new QueryClient();

export const Providers = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};