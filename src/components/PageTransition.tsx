"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPresent, setIsPresent] = useState(false);

  useEffect(() => {
    setIsPresent(true);
    return () => setIsPresent(false);
  }, [pathname]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ originY: isPresent ? 0 : 1 }}
      />
      <motion.div
        className="fixed inset-0 z-40 bg-[#0a0a0a] pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
        style={{ originY: isPresent ? 0 : 1 }}
      />
      {children}
    </>
  );
}
