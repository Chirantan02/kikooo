"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";
import { clashDisplay } from "@/fonts";
import Link from "next/link";
import ProjectCard3D from "@/components/ProjectCard3D";
import ParallaxSection from "@/components/ParallaxSection";
import Image3DHover from "@/components/Image3DHover";
import GradientBackground from "@/components/GradientBackground";
import MagneticButton from "@/components/MagneticButton";
import TextReveal from "@/components/TextReveal";

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the project by ID
    const projectId = Number(params.id);
    const foundProject = projects.find((p) => p.id === projectId);

    if (foundProject) {
      setProject(foundProject);
    }

    // Set loading to false immediately for seamless transition
    setLoading(false);
  }, [params.id]);

  // Handle back navigation with animation
  const handleBack = () => {
    router.push("/");
  };



  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className={`${clashDisplay.className} text-4xl mb-6`}>Project not found</h1>
          <button
            onClick={handleBack}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-6 py-3 rounded-md transition-all duration-300"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Back button with animation */}
      <div className="fixed top-8 left-8 z-50">
        <MagneticButton
          onClick={handleBack}
          className="bg-black bg-opacity-50 backdrop-blur-md text-white p-4 rounded-full hover:bg-opacity-70 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </MagneticButton>
      </div>

      {/* Hero section with interactive gradient background */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <GradientBackground
            colors={[
              "#111111",
              "#333333",
              "#222222",
              "#444444"
            ]}
            speed={5}
            interactive={true}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="perspective-container"
          >
            <TextReveal
              text={project.title}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
              delay={0.1}
              duration={0.03}
            />

            <motion.div
              className="w-24 h-1 bg-white mx-auto mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            ></motion.div>

            <TextReveal
              text={project.description}
              className="text-white text-xl md:text-2xl max-w-3xl mx-auto"
              delay={0.3}
              duration={0.01}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="w-8 h-12 border-2 border-white rounded-full flex justify-center p-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <motion.div className="w-1 h-3 bg-white rounded-full"></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Project content with 3D scroll effects */}
      <div className="bg-[#0a0a0a] relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
          {/* Project overview section */}
          <motion.div
            className="mb-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              className={`${clashDisplay.className} text-white text-3xl md:text-5xl font-bold mb-12`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Project Overview
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className={`${clashDisplay.className} text-gray-300 text-lg md:text-xl leading-relaxed mb-8`}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam,
                  nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam euismod, nisl eget ultricies aliquam,
                  nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.
                </p>
                <p className={`${clashDisplay.className} text-gray-300 text-lg md:text-xl leading-relaxed`}>
                  Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </motion.div>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
                  <h3 className={`${clashDisplay.className} text-white text-xl font-bold mb-4`}>Client</h3>
                  <p className={`${clashDisplay.className} text-gray-300`}>Fortune 500 Company</p>
                </div>

                <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
                  <h3 className={`${clashDisplay.className} text-white text-xl font-bold mb-4`}>Timeline</h3>
                  <p className={`${clashDisplay.className} text-gray-300`}>6 months</p>
                </div>

                <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
                  <h3 className={`${clashDisplay.className} text-white text-xl font-bold mb-4`}>Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech) => (
                      <span key={tech} className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Project details with parallax images */}
          <div className="space-y-40">
            {/* Section 1 - Enhanced with ParallaxSection */}
            <ParallaxSection
              title="The Challenge"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              gradientColors={["#1a1a2e", "#16213e", "#0f3460", "#1a1a2e"]}
            />

            {/* Section 2 - Enhanced with ParallaxSection */}
            <ParallaxSection
              title="The Solution"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              gradientColors={["#240046", "#3c096c", "#5a189a", "#240046"]}
              reverse={true}
            />

            {/* Section 3 - Enhanced with ParallaxSection */}
            <ParallaxSection
              title="The Results"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              gradientColors={["#10002b", "#240046", "#3c096c", "#10002b"]}
            />

            {/* Additional 3D cards section */}
            <motion.div
              className="py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                className={`${clashDisplay.className} text-white text-3xl md:text-5xl font-bold mb-16 text-center`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Key Features
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ProjectCard3D
                  title="Responsive Design"
                  description="Fully responsive layout that works on all devices and screen sizes"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  }
                />

                <ProjectCard3D
                  title="Modern Technologies"
                  description="Built with the latest technologies for optimal performance"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                <ProjectCard3D
                  title="User Experience"
                  description="Intuitive interface designed with the user in mind"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>
            </motion.div>

            {/* Image gallery with 3D hover effect */}
            <motion.div
              className="py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                className={`${clashDisplay.className} text-white text-3xl md:text-5xl font-bold mb-16 text-center`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Project Gallery
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Image3DHover className="aspect-[4/3] w-full" colors={["#3a0ca3", "#4361ee", "#4cc9f0", "#3a0ca3"]} />
                <Image3DHover className="aspect-[4/3] w-full" colors={["#7209b7", "#560bad", "#480ca8", "#7209b7"]} />
                <Image3DHover className="aspect-[4/3] w-full" colors={["#f72585", "#b5179e", "#7209b7", "#f72585"]} />
                <Image3DHover className="aspect-[4/3] w-full" colors={["#4cc9f0", "#4895ef", "#4361ee", "#4cc9f0"]} />
                <Image3DHover className="aspect-[4/3] w-full" colors={["#f72585", "#b5179e", "#7209b7", "#f72585"]} />
                <Image3DHover className="aspect-[4/3] w-full" colors={["#3a0ca3", "#4361ee", "#4cc9f0", "#3a0ca3"]} />
              </div>
            </motion.div>
          </div>

          {/* Full-width image with parallax */}
          <motion.div
            className="relative h-[300px] md:h-[500px] mt-40 mb-40 overflow-hidden rounded-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="absolute inset-0 rounded-lg overflow-hidden"
              whileInView={{ y: [0, -30] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <GradientBackground
                colors={["#3a0ca3", "#4361ee", "#4cc9f0", "#3a0ca3"]}
                speed={7}
                interactive={true}
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className={`${clashDisplay.className} text-white text-3xl md:text-5xl font-bold text-center max-w-3xl`}>
                A stunning showcase of design and functionality
              </h3>
            </div>
          </motion.div>

          {/* Testimonial section */}
          <motion.div
            className="bg-black/30 backdrop-blur-sm border border-white/10 p-10 md:p-16 rounded-lg mb-32"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col items-center text-center">
              <svg className="w-16 h-16 text-white/20 mb-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className={`${clashDisplay.className} text-white text-xl md:text-2xl italic mb-8 max-w-3xl`}>
                "Working with Chirantan was an absolute pleasure. The attention to detail and creative solutions provided exceeded our expectations. The final product was not only visually stunning but also perfectly functional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
                <div className="text-left">
                  <p className={`${clashDisplay.className} text-white font-bold`}>John Smith</p>
                  <p className={`${clashDisplay.className} text-gray-400 text-sm`}>CEO, Example Company</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next project navigation */}
          <motion.div
            className="border-t border-white/10 pt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col items-center text-center">
              <p className={`${clashDisplay.className} text-gray-400 text-lg mb-4`}>Next Project</p>
              <Link href={`/projects/${project.id < projects.length ? project.id + 1 : 1}`} className="group">
                <h3 className={`${clashDisplay.className} text-white text-3xl md:text-5xl font-bold mb-8 group-hover:text-gray-300 transition-colors duration-300`}>
                  {projects.find(p => p.id === (project.id < projects.length ? project.id + 1 : 1))?.title}
                </h3>
                <div className="flex justify-center">
                  <motion.div
                    className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.div>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
