"use client";

import { clashDisplay } from "@/fonts";
import { AnimatePresence } from "framer-motion";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <div className={`${clashDisplay.className} min-h-screen bg-black`}>
        {children}
      </div>
    </AnimatePresence>
  );
}
