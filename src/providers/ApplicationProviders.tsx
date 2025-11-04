"use client";

import useAppTheme from "@/hooks/useAppTheme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { Bounce, ToastContainer } from "react-toastify";
import { prefixer } from "stylis";
import AuthProvider from "./AuthProvider";

type Props = {
  children: React.ReactNode;
};

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const ApplicationProviders = ({ children }: Props) => {
  const theme = useAppTheme();
  return (
    <AuthProvider>
      <CacheProvider value={rtlCache}>
        {/* <QueryClientProvider client={queryClient}> */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <ToastContainer
            hideProgressBar={true}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={true}
            theme={"light"}
            transition={Bounce}
            position={"top-right"}
            autoClose={5000}
            rtl
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
        {/* </QueryClientProvider> */}
      </CacheProvider>
    </AuthProvider>
  );
};

export default ApplicationProviders;
