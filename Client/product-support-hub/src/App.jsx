import { useState } from 'react';
import AppRoutes from './Navigation/AppRoutes';
import './App.css';

import { ThomsonReutersThemeProvider } from './Context/ThomsonReutersThemeContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './ErrorBoundary.jsx';
import CustomErrorFallback from './Components/CustomErrorFallback.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import { BugProvider } from './Context/BugContext.jsx';

function App() {
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
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThomsonReutersThemeProvider>
              <BugProvider>
                <AppRoutes />
              </BugProvider>
            </ThomsonReutersThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
