"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { clashDisplay } from "@/fonts";
import GradientBackground from "./GradientBackground";

interface ParallaxSectionProps {
  image?: string;
  title: string;
  subtitle: string;
  reverse?: boolean;
  gradientColors?: string[];
}

export default function ParallaxSection({
  image,
  title,
  subtitle,
  reverse = false,
  gradientColors = ["#111111", "#333333", "#222222", "#444444"]
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
              speed={3}
              interactive={true}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </motion.div>
  );
}
