'use client'
import React from 'react';
import { DataProvider } from './DataProvider';
import { ThemeProvider } from './ThemeProvider';
import { ExpeditionProvider } from './ExpeditionProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

export const Providers = ({ children, session }: React.PropsWithChildren<{ session?: any }>) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DataProvider>
            <ExpeditionProvider>
              {children}
            </ExpeditionProvider>
          </DataProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
