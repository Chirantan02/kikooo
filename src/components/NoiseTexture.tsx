"use client";

import { useEffect, useRef } from "react";

interface NoiseTextureProps {
  opacity?: number;
  className?: string;
}

export default function NoiseTexture({ 
  opacity = 0.05, 
  className = "" 
}: NoiseTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Generate noise
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // red
        data[i + 1] = value; // green
        data[i + 2] = value; // blue
        data[i + 3] = Math.random() * 50; // alpha (transparency)
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    generateNoise();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
