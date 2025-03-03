'use client';

import { QueryClient, QueryClientProvider as TanstackQueryProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function QueryClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TanstackQueryProvider client={queryClient}>
      {children}
    </TanstackQueryProvider>
  );
}
