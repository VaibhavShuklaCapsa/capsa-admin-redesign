'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



export default function QueryProvider({children} ) {
//   const queryClient = useState(() => new QueryClient());
const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
