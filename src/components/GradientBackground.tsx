"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface GradientBackgroundProps {
  className?: string;
  colors?: string[];
  speed?: number;
  interactive?: boolean;
}

export default function GradientBackground({
  className = "",
  colors = ["#4A00E0", "#8E2DE2", "#FF416C", "#FF4B2B"],
  speed = 10,
  interactive = true,
}: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const gradientSize = useRef(1.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Track mouse position if interactive
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Animation variables
    let time = 0;

    // Animation function
    const animate = () => {
      time += 0.0005 * speed; // Reduced from 0.003 to 0.0005 for much slower animation

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ensure mousePosition values are valid numbers and within range
      const mouseX = interactive && !isNaN(mousePosition.current.x) && isFinite(mousePosition.current.x)
        ? Math.max(0, Math.min(1, mousePosition.current.x))
        : 0.5;

      const mouseY = interactive && !isNaN(mousePosition.current.y) && isFinite(mousePosition.current.y)
        ? Math.max(0, Math.min(1, mousePosition.current.y))
        : 0.5;

      // Create gradient with validated values
      const gradient = ctx.createRadialGradient(
        canvas.width * mouseX,
        canvas.height * mouseY,
        0,
        canvas.width * mouseX,
        canvas.height * mouseY,
        canvas.width * gradientSize.current
      );

      // Add color stops
      colors.forEach((color, i) => {
        const offset = (i / (colors.length - 1) + time) % 1;
        gradient.addColorStop(offset, color);
      });

      // Fill canvas with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Continue animation
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [colors, speed, interactive]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
