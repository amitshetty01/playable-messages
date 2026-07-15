"use client";

import { createContext, useContext } from "react";

const DemoContext = createContext(false);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  return (
    <DemoContext.Provider value={true}>
      {children}
    </DemoContext.Provider>
  );
}

export function useIsDemo() {
  return useContext(DemoContext);
}
