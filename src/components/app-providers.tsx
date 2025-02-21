"use client";

import { ReactNode } from "react";

import { QueryProvider } from "./query-provider";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
};

export { AppProviders };
