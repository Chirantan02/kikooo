"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { clashDisplay } from "@/fonts";
import GradientBackground from "./GradientBackground";

interface ParallaxSectionProps {
  title: string;
  subtitle: string;
  reverse?: boolean;
  gradientColors?: string[];
  overlayStyle?: number; // Added to control different gradient overlay styles
}

export default function ParallaxSection({
  title,
  subtitle,
  reverse = false,
  gradientColors = ["#111111", "#333333", "#222222", "#444444"],
  overlayStyle = 0 // Default overlay style
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className={`${reverse ? 'md:order-2' : 'md:order-1'}`}>
          <motion.h2
            className={`${clashDisplay.className} text-white text-3xl md:text-5xl font-bold mb-6`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>

          <motion.p
            className={`${clashDisplay.className} text-gray-300 text-lg md:text-xl leading-relaxed`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className={`relative h-[400px] md:h-[600px] overflow-hidden rounded-lg ${reverse ? 'md:order-1' : 'md:order-2'}`}>
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{ y, scale, opacity }}
          >
            <GradientBackground
              colors={gradientColors}
              speed={0.5} // Reduced from 3 to 0.5
              interactive={true}
            />
          </motion.div>

          {/* Dynamic gradient overlay based on style */}
          {overlayStyle === 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
          )}

          {overlayStyle === 1 && (
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-transparent to-black/40 rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
          )}

          {overlayStyle === 2 && (
            <motion.div
              className="absolute inset-0 bg-gradient-conic from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
          )}

          {overlayStyle === 3 && (
            <motion.div
              className="absolute inset-0 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-400/20 via-fuchsia-500/10 to-indigo-500/20" />
            </motion.div>
          )}

          {overlayStyle === 4 && (
            <motion.div
              className="absolute inset-0 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-600/30" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(49,16,189,0.1),rgba(49,16,189,0),rgba(49,16,189,0.1))]" />
              <div className="absolute inset-0 backdrop-blur-[1px]" />
            </motion.div>
          )}

          {overlayStyle === 5 && (
            <motion.div
              className="absolute inset-0 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(40deg,rgba(0,200,255,0.15),rgba(0,0,200,0))]" />
              <div className="absolute inset-0 bg-[linear-gradient(210deg,rgba(0,0,0,0),rgba(102,0,255,0.1))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,0,255,0.15),rgba(0,0,0,0))]" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
