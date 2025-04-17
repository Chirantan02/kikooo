"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import GradientBackground from "./GradientBackground";

interface Image3DHoverProps {
  className?: string;
  colors?: string[];
}

export default function Image3DHover({
  className = "",
  colors = ["#111111", "#333333", "#222222", "#444444"]
}: Image3DHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setMousePosition({ x, y });
  };

  const rotateX = isHovered ? (mousePosition.y - 0.5) * 20 : 0;
  const rotateY = isHovered ? (mousePosition.x - 0.5) * -20 : 0;

  return (
    <motion.div
      ref={imageRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.5,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="w-full h-full rounded-lg overflow-hidden">
          <GradientBackground
            colors={colors}
            speed={0.5} // Reduced from 3 to 0.5
            interactive={false}
          />
        </div>

        {/* Lighting effect */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${mousePosition.x * 100}% ${
                  mousePosition.y * 100
                }%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%)`
              : "none",
            boxShadow: isHovered ? "0 10px 30px -5px rgba(0, 0, 0, 0.5)" : "none",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
