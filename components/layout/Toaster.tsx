"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme === "dark" ? "dark" : "light") as
    | "dark"
    | "light";

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-border/70 bg-card/90 backdrop-blur-xl text-sm",
          description: "text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground rounded-md px-2 py-1",
          cancelButton: "bg-secondary text-foreground rounded-md px-2 py-1",
        },
      }}
    />
  );
}
