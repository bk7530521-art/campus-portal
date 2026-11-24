"use client";

import React from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { CampusProvider } from "@/context/CampusContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CampusProvider>{children}</CampusProvider>
    </ToastProvider>
  );
}
