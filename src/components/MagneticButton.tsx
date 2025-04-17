"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { clashDisplay } from "@/fonts";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
  strength = 40,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Calculate distance from center as a percentage of button size
    const magneticX = (distanceX / (width / 2)) * strength;
    const magneticY = (distanceY / (height / 2)) * strength;

    setPosition({ x: magneticX, y: magneticY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${clashDisplay.className} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="relative z-10 block"
        animate={{ x: position.x * 0.2, y: position.y * 0.2 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.span>
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-full"
        animate={{ 
          x: position.x * 0.1, 
          y: position.y * 0.1,
          scale: 1.1
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />
    </motion.button>
  );
}
