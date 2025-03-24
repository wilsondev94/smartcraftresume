"use client";

import { SubOptions } from "@/lib/subscription";
import { createContext, ReactNode, useContext } from "react";

const SubLevelContext = createContext<SubOptions | undefined>(undefined);

interface SubLevelProviderProps {
  children: ReactNode;
  userSubLevel: SubOptions;
}

export default function SubLevelProvider({
  children,
  userSubLevel,
}: SubLevelProviderProps) {
  return (
    <SubLevelContext.Provider value={userSubLevel}>
      {children}
    </SubLevelContext.Provider>
  );
}

export function useSubLevel() {
  const context = useContext(SubLevelContext);

  if (context === undefined) {
    throw new Error("userSubLevel must be use within the SubLevelProvider");
  }

  return context;
}
