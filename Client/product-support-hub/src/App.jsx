import { useState } from 'react';
import AppRoutes from './Navigation/AppRoutes';
import './App.css';
import { useLogger } from '../src/Hook/useLogger.js';
import { ThomsonReutersThemeProvider } from './Context/ThomsonReutersThemeContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './ErrorBoundary.jsx';
import CustomErrorFallback from './Components/CustomErrorFallback.jsx';

function App() {
  const logger = useLogger();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <div>
      <ErrorBoundary fallback={CustomErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <ThomsonReutersThemeProvider>
            <AppRoutes />
          </ThomsonReutersThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
