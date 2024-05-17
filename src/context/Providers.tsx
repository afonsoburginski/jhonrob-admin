// Providers.tsx
'use client'
import React from 'react';
import { DataProvider } from './DataProvider';
import { ThemeProvider } from './ThemeProvider';
import { ExpeditionProvider } from './ExpeditionProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export const Providers = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DataProvider>
          <ExpeditionProvider>
            {children}
          </ExpeditionProvider>
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};