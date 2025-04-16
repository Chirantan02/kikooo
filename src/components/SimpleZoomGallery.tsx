import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactSection from './ContactSection';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Define ordered projects with new images
const orderedProjects = [
  { id: 1, image: '/projects/project1.jpg', title: 'Project 1', description: 'Project 1 Description' },
  { id: 2, image: '/projects/project2.jpg', title: 'Project 2', description: 'Project 2 Description' },
  { id: 3, image: '/projects/project3.jpg', title: 'Project 3', description: 'Project 3 Description' },
  { id: 4, image: '/projects/project4.jpg', title: 'Project 4', description: 'Project 4 Description' },
  { id: 5, image: '/projects/project5.jpg', title: 'Project 5', description: 'Project 5 Description' },
  { id: 6, image: '/projects/project6.png', title: 'Project 6', description: 'Project 6 Description' },
  { id: 7, image: '/projects/project7.jpg', title: 'Project 7', description: 'Project 7 Description' },
  { id: 8, image: '/projects/project8.jpg', title: 'Project 8', description: 'Project 8 Description' },
  { id: 9, image: '/projects/project9.jpg', title: 'Project 9', description: 'Project 9 Description' },
];

const SimpleZoomGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial setup - stack all images with decreasing scale and opacity
      imageRefs.current.forEach((image, idx) => {
        if (image) {
          gsap.set(image, {
            scale: 1 - (idx * 0.05),
            opacity: 1 - (idx * 0.15),
            z: -50 * idx,
            transformOrigin: 'center center'
          });
        }
      });

      // Set up scroll triggers for each section
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          onEnter: () => {
            setActiveIndex(index);

            // Animate current image to full size and opacity
            imageRefs.current.forEach((image, idx) => {
              if (image) {
                gsap.to(image, {
                  scale: idx === index ? 1 : 1 - ((idx - index) * 0.05),
                  opacity: idx === index ? 1 : Math.max(0, 1 - ((idx - index) * 0.15)),
                  z: -50 * Math.abs(idx - index),
                  duration: 1,
                  ease: 'power2.out'
                });
              }
            });
          }
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-black min-h-screen relative perspective-1000">
      {/* Fixed image container */}
      <div className="fixed inset-0 flex items-center justify-center">
        {orderedProjects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { imageRefs.current[index] = el; }}
            className="absolute w-[80vw] h-[80vh] transition-all duration-500"
            style={{ transform: `translateZ(${-50 * index}px)` }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="80vw"
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-white text-2xl font-bold">{project.title}</h2>
                <p className="text-white/80 mt-2">{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll sections */}
      <div className="relative">
        {orderedProjects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className="h-screen w-full"
          />
        ))}
      </div>

      {/* Project counter */}
      <div className="fixed bottom-8 right-8 bg-black/70 text-white px-4 py-2 rounded-lg z-50">
        {activeIndex + 1} / {orderedProjects.length}
      </div>

      <ContactSection />
    </div>
  );
};

export default SimpleZoomGallery;
