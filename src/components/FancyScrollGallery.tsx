import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FancyScrollGallery: React.FC = () => {
  // State to track current active project index
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Create refs for the container and sections
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize ScrollTrigger and animations
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a context to isolate GSAP animations
    const ctx = gsap.context(() => {
      // Set up each project section
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        
        // Get the image container
        const imageContainer = imageRefs.current[index];
        if (!imageContainer) return;
        
        // Create the ScrollTrigger for this section
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%', // Start when the top of the section is 80% from the top of the viewport
          end: 'bottom 20%', // End when the bottom of the section is 20% from the top of the viewport
          scrub: 1, // 1 second smoothing lag for slow effect
          onEnter: () => {
            console.log(`Entering section ${index}`);
            setActiveIndex(index);
            
            // Animate the current image
            gsap.to(imageContainer, {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            });
            
            // Animate previous images out
            imageRefs.current.forEach((img, i) => {
              if (i !== index && img) {
                gsap.to(img, {
                  scale: 0.8,
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.in"
                });
              }
            });
          },
          onUpdate: (self) => {
            // Calculate scale based on progress (1.0 to 1.5)
            const scale = 1 + (self.progress * 0.5);
            
            // Apply scale to the image container
            gsap.to(imageContainer, {
              scale: scale,
              duration: 0.1, // Very short duration for responsive feel
              ease: "power2.inOut"
            });
            
            // Add a parallax effect to the image
            const yOffset = self.progress * -50; // Move up by 50px at full progress
            gsap.to(imageContainer, {
              y: yOffset,
              duration: 0.1
            });
            
            console.log(`Section ${index} progress: ${self.progress.toFixed(2)}, scale: ${scale.toFixed(2)}`);
          }
        });
      });
    }, containerRef);
    
    // Initial setup - set all images to scale 0 and opacity 0 except the first one
    imageRefs.current.forEach((img, idx) => {
      if (img) {
        gsap.set(img, {
          scale: idx === 0 ? 1 : 0.8,
          opacity: idx === 0 ? 1 : 0,
          y: 0
        });
      }
    });
    
    // Cleanup function
    return () => {
      ctx.revert(); // Clean up all GSAP animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all ScrollTriggers
    };
  }, []);
  
  return (
    <div ref={containerRef} className="bg-black min-h-screen">
      {/* Project sections */}
      {projects.map((project, index) => (
        <div 
          key={project.id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          className="min-h-screen w-full flex items-center justify-center relative py-20"
          style={{ 
            background: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(20,20,20,1) 50%, rgba(0,0,0,1) 100%)`
          }}
        >
          {/* Project image with fancy container */}
          <div 
            ref={(el) => { imageRefs.current[index] = el; }}
            className="relative w-[85vw] md:w-[70vw] aspect-video overflow-hidden rounded-lg transform-gpu"
            style={{ 
              boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Fancy border */}
            <div className="absolute inset-0 border border-white border-opacity-20 rounded-lg z-20 pointer-events-none"></div>
            
            {/* Glare effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 z-10 pointer-events-none"></div>
            
            {/* Image */}
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform"
                sizes="(max-width: 768px) 85vw, 70vw"
                priority={index === 0}
              />
            </div>
            
            {/* Project info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 z-30">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">{project.title}</h2>
              <p className="text-white text-lg md:text-xl opacity-80">{project.description}</p>
            </div>
          </div>
          
          {/* Scroll indicator for all but the last section */}
          {index < projects.length - 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-white text-sm mb-2">Scroll</span>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-1 animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Fixed navigation */}
      <div className="fixed bottom-8 right-8 bg-black bg-opacity-70 backdrop-blur-sm text-white px-6 py-3 rounded-full z-50 flex items-center">
        <span className="text-2xl font-bold">{activeIndex + 1}</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-400">{projects.length}</span>
      </div>
      
      {/* Fixed dots navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-3">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-30 hover:bg-opacity-50'
              }`}
              onClick={() => {
                // Scroll to the section
                sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FancyScrollGallery;
