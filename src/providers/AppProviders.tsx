import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router";

import { queryClient } from "./query-client";
import { AuthProvider } from "./AuthContext";

import i18next from "../i18n";

type AppProvidersProps = {
  children: React.ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  );
};
