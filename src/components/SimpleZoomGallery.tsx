import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactSection from './ContactSection';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleZoomGallery: React.FC = () => {
  // State to track current active project index
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Create refs for the container and sections
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize ScrollTrigger and animations
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a context to isolate GSAP animations
    const ctx = gsap.context(() => {
      // Set up each project section
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        
        // Get the image element
        const image = section.querySelector('.project-image');
        if (!image) return;
        
        // Create the ScrollTrigger for this section
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom', // Start when the top of the section reaches the bottom of the viewport
          end: 'bottom top', // End when the bottom of the section reaches the top of the viewport
          scrub: 1, // 1 second smoothing lag for slow effect
          onEnter: () => {
            console.log(`Entering section ${index}`);
            setActiveIndex(index);
          },
          onUpdate: (self) => {
            // Calculate scale based on progress (1.0 to 1.5)
            const scale = 1 + (self.progress * 0.5);
            
            // Apply scale to the image
            gsap.to(image, {
              scale: scale,
              duration: 0.1, // Very short duration for responsive feel
              ease: "power2.inOut"
            });
            
            console.log(`Section ${index} progress: ${self.progress.toFixed(2)}, scale: ${scale.toFixed(2)}`);
          }
        });
      });
    }, containerRef);
    
    // Cleanup function
    return () => {
      ctx.revert(); // Clean up all GSAP animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all ScrollTriggers
    };
  }, []);
  
  return (
    <div ref={containerRef} className="bg-black">
      {/* Project sections */}
      {projects.map((project, index) => (
        <div 
          key={project.id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          className="h-screen w-full flex items-center justify-center relative"
        >
          {/* Project image */}
          <div className="relative w-[80vw] h-[80vh] overflow-hidden flex items-center justify-center">
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={800}
              className="project-image object-cover max-w-full max-h-full"
              priority={true}
            />
            
            {/* Project title */}
            <div className="absolute bottom-8 left-8 bg-black bg-opacity-70 p-4 rounded-lg">
              <h2 className="text-white text-2xl font-bold">{project.title}</h2>
              <p className="text-white mt-2">{project.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Project counter */}
      <div className="fixed bottom-8 right-8 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-50">
        {activeIndex + 1} / {projects.length}
      </div>
      
      {/* Contact section at the end */}
      <ContactSection />
    </div>
  );
};

export default SimpleZoomGallery;
