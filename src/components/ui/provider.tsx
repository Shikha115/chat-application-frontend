"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import type { ReactNode } from "react";

interface UiProviderProps extends ColorModeProviderProps {
  children?: ReactNode;
}

export function UiProvider({ children, ...props }: UiProviderProps) {
  // useEffect(() => {
  //   try {
  //     // Respect next-themes storageKey 'theme' set in ColorModeProvider
  //     const stored =
  //       typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  //     const theme = stored || "light";
  //     // enforce class on documentElement for immediate effect in this tab
  //     if (typeof document !== "undefined") {
  //       document.documentElement.classList.remove("dark", "light");
  //       document.documentElement.classList.add(theme);
  //     }

  //     // sync across tabs: listen to storage events and update class accordingly
  //     const onStorage = (e: StorageEvent) => {
  //       if (e.key === "theme") {
  //         const newTheme = e.newValue || "light";
  //         document.documentElement.classList.remove("dark", "light");
  //         document.documentElement.classList.add(newTheme);
  //       }
  //     };
  //     window.addEventListener("storage", onStorage);
  //     return () => window.removeEventListener("storage", onStorage);
  //   } catch (err) {
  //     // ignore in non-browser environments
  //   }
  // }, []);

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
