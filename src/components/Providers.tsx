"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerClassName="p-6"
        containerStyle={{
          zIndex: 9999,
        }}
      />
    </ThemeProvider>
  );
}
