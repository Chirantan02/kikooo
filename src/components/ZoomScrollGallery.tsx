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

const ZoomScrollGallery: React.FC = () => {
  // Create refs for the container, image containers, and trigger elements
  const containerRef = useRef<HTMLDivElement>(null);
  const imgContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State to track current active project index and loading state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize ScrollTrigger and animations
  // Effect to initialize the first image and ensure it's visible
  useEffect(() => {
    console.log('Initializing first image');
    // Longer delay to ensure DOM is fully ready
    const initialTimer = setTimeout(() => {
      console.log('Initial timer fired');

      // FORCE RESET ALL IMAGES FIRST
      imgContainerRefs.current.forEach((container, idx) => {
        if (container) {
          console.log(`Setting initial state for image ${idx}`);
          // Hide all images initially
          gsap.set(container, {
            opacity: 0,
            scale: 0.05,
            zIndex: 10 + idx
          });

          // Also reset any inner containers
          const innerContainer = container.querySelector('div');
          if (innerContainer) {
            gsap.set(innerContainer, {
              scale: 0.05,
              opacity: 0
            });
          }
        }
      });

      // Now explicitly show ONLY the first image
      if (imgContainerRefs.current[0]) {
        console.log('Making first image visible');
        const firstImageContainer = imgContainerRefs.current[0].querySelector('div');
        if (firstImageContainer) {
          gsap.set(firstImageContainer, {
            scale: 1,
            opacity: 1,
            transformOrigin: 'center center'
          });
        }

        gsap.set(imgContainerRefs.current[0], {
          opacity: 1,
          zIndex: 20,
          scale: 1
        });
      }

      // Set loading to false after a longer delay
      setTimeout(() => {
        console.log('Setting loading to false');

        // Force scroll to top
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
          console.log('Forced scroll to top');
        }

        // Reset state
        setIsLoading(false);
        setActiveIndex(0); // Explicitly set to first image
      }, 2000);
    }, 1000);

    return () => clearTimeout(initialTimer);
  }, []);

  // Main effect to set up ScrollTrigger
  useEffect(() => {
    if (!containerRef.current) return;

    // Create a context to isolate GSAP animations
    const ctx = gsap.context(() => {
      // Set up each project section
      projects.forEach((project, index) => {
        const imgContainer = imgContainerRefs.current[index];
        const trigger = triggerRefs.current[index];

        if (!imgContainer || !trigger) return;

        // Calculate target scale based on viewport and image dimensions
        const calculateTargetScale = (element: HTMLElement) => {
          // Get viewport dimensions
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Get image dimensions (approximated from the container)
          const imgWidth = element.offsetWidth;
          const imgHeight = element.offsetHeight;

          // Calculate the scale needed to overfill the viewport by 350px in each dimension
          const widthScale = (viewportWidth + 350) / imgWidth;
          const heightScale = (viewportHeight + 350) / imgHeight;

          // Use the larger scale to ensure the image covers the viewport in both dimensions
          return Math.max(1.5, widthScale, heightScale);
        };

        // Get the target scale for this image
        const targetScale = calculateTargetScale(imgContainer);

        // Create the ScrollTrigger for this section
        ScrollTrigger.create({
          trigger: trigger,
          start: "top bottom", // Start when the top of the trigger reaches the bottom of the viewport
          end: "bottom top", // End when the bottom of the trigger reaches the top of the viewport
          scrub: true, // Enable scrubbing with default smoothing
          markers: true, // Enable markers for debugging
          onEnter: () => {
            console.log(`Entering section ${index}`);

            // Skip automatic transitions during initial loading
            if (isLoading) {
              console.log('Still loading, skipping transition');
              return;
            }

            // Update active index when entering a new section
            setActiveIndex(index);

            // Make current image visible and bring to front
            imgContainerRefs.current.forEach((container, idx) => {
              if (container) {
                // Set z-index based on whether this is the current container
                gsap.set(container, {
                  zIndex: idx === index ? 20 : 10 + idx
                });

                // Handle visibility
                if (idx === index) {
                  // Show current image
                  gsap.to(container, {
                    opacity: 1,
                    duration: 0.5
                  });
                } else if (idx < index) {
                  // Hide previous images
                  gsap.to(container, {
                    opacity: 0,
                    duration: 0.5
                  });
                }
              }
            });
          },
          onUpdate: (self) => {
            // Skip if still loading
            if (isLoading) return;

            // Update animation based on scroll progress
            const progress = self.progress;

            // Find the image container div inside the main container
            const imageContainer = imgContainer.querySelector('div');

            console.log(`Updating image ${index} with progress ${progress.toFixed(2)}`);

            // Apply the scale directly based on progress to the image container
            if (imageContainer) {
              // Use set instead of to for immediate update
              gsap.set(imageContainer, {
                scale: 1.0 + (progress * (targetScale - 1.0)),
                ease: "power2.inOut"
              });

              // Also update opacity if needed
              if (index === activeIndex) {
                gsap.set(imgContainer, {
                  opacity: 1
                });
              }
            } else {
              // Fallback to scaling the main container if inner div not found
              gsap.set(imgContainer, {
                scale: 1.0 + (progress * (targetScale - 1.0)),
                ease: "power2.inOut"
              });
            }

            // Log progress for debugging
            console.log(`Image ${index} progress: ${progress.toFixed(2)}, scale: ${(1.0 + (progress * (targetScale - 1.0))).toFixed(2)}`);
          },
          onLeave: () => {
            console.log(`Leaving section ${index}`);

            // If we're moving to the next section, prepare the next image
            if (index < projects.length - 1) {
              const nextContainer = imgContainerRefs.current[index + 1];
              if (nextContainer) {
                // Ensure the next image is ready to be shown
                gsap.set(nextContainer, {
                  zIndex: 20,
                  scale: 0.05 // Start from small scale
                });
              }
            }
          }
        });
      });
    }, containerRef);

    // Initial setup - set all images to scale 0 and opacity 0 except the first one
    // This is now handled in the first useEffect to avoid race conditions

    // Cleanup function
    return () => {
      ctx.revert(); // Clean up all GSAP animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all ScrollTriggers
    };
  }, [activeIndex, isLoading]);

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-black smooth-scroll momentum-scroll">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
          <div className="text-white text-xl mb-4">Loading projects...</div>
          <div className="text-white text-sm">Preparing first image</div>
        </div>
      )}

      {/* Main scrollable content */}
      <div className="relative min-h-screen">
        {/* Fixed image containers */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          {projects.map((project, index) => (
            <div
              key={`img-${project.id}`}
              ref={(el) => { imgContainerRefs.current[index] = el; }}
              className="img-container absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                // Initial styles will be set by GSAP in useEffect
                transformOrigin: 'center center'
              }}
            >
              <div className="relative w-[80vw] h-[80vh] bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="zoom-images object-cover transition-transform"
                  priority={true}
                  sizes="80vw"
                />
              </div>
              <div className="absolute bottom-8 left-8 text-white text-xl font-bold bg-black bg-opacity-50 p-2 rounded">
                {project.title}
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable trigger sections - this creates the scrollable height */}
        <div className="relative z-10" style={{ height: `${projects.length * 100}vh` }}>
          {projects.map((project, index) => (
            <div
              key={`trigger-${project.id}`}
              ref={(el) => { triggerRefs.current[index] = el; }}
              className="white-height h-screen w-full bg-red-500 bg-opacity-10"
            >
              {/* Empty div to create scroll height */}
              <div className="opacity-0 pointer-events-none h-full">
                {project.title}
              </div>
            </div>
          ))}
        </div>

        {/* Project counter */}
        <div className="fixed bottom-8 right-8 text-white text-lg font-bold z-50 bg-black bg-opacity-70 p-3 rounded-lg">
          {activeIndex + 1} / {projects.length}
        </div>

        {/* Contact section at the end */}
        <div className="relative" style={{ marginTop: `${projects.length * 100}vh` }}>
          <ContactSection />
        </div>

        {/* Current project title - large display */}
        <div className="fixed bottom-24 left-8 text-white text-3xl font-bold z-50 bg-black bg-opacity-70 p-4 rounded-lg">
          {projects[activeIndex].title}
        </div>
      </div>
    </div>
  );
};

export default ZoomScrollGallery;
