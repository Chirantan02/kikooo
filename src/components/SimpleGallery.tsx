import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { Playfair_Display } from 'next/font/google';
import { motion } from 'framer-motion';
import { clashDisplay } from '@/fonts';

// Load premium fonts
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

const SimpleGallery: React.FC = () => {
  // References for scrolling to sections
  const worksRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
        <div className={`${playfair.className} text-white text-xl font-medium tracking-wider`}>Khushi</div>
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(worksRef)}
            className={`${clashDisplay.className} text-white text-lg font-light hover:text-gray-300 transition-colors`}
          >
            Works
          </button>
          <button
            onClick={() => scrollToSection(infoRef)}
            className={`${clashDisplay.className} text-white text-lg font-light hover:text-gray-300 transition-colors`}
          >
            About
          </button>
        </div>
      </header>

      <main>
        <div ref={worksRef} className="pt-32 px-8 bg-[#0a0a0a]">
          <h1 className={`${clashDisplay.className} text-white text-4xl md:text-7xl font-semibold tracking-tight mb-2`}>Archive of</h1>
          <h1 className={`${clashDisplay.className} text-white text-4xl md:text-7xl font-semibold tracking-tight`}>Selected Works</h1>

          <div className="mt-24 space-y-40">
            {projects.map((project, index) => (
              <div key={project.id} className="min-h-screen flex items-center justify-center">
                {project.liveUrl ? (
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block w-full max-w-6xl">
                    <motion.div
                      className="relative w-full overflow-hidden rounded-lg shadow-2xl group cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-100px" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          priority={index < 2}
                          className="transition-transform duration-700"
                        />
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <Link href={`/projects/${project.id}`} className="block w-full max-w-6xl">
                    <motion.div
                      className="relative w-full overflow-hidden rounded-lg shadow-2xl group cursor-pointer"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-100px" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          priority={index < 2}
                          className="transition-transform duration-700"
                        />
                      </div>
                    </motion.div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* About Me Section */}
        <div ref={infoRef} className="min-h-screen w-full bg-[#0a0a0a] px-8 py-24 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-[10%] w-[80%] h-px bg-white/10"></div>
          <div className="absolute bottom-0 left-[10%] w-[80%] h-px bg-white/10"></div>

          <div className="max-w-[1400px] mx-auto relative z-10">
            {/* Large, impactful heading */}
            <motion.div
              className="mb-32 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="font-['Helvetica_Neue'] text-white text-7xl md:text-[10rem] font-bold tracking-tighter leading-[0.9] uppercase"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
                viewport={{ once: true }}
              >
                ABOUT
              </motion.h2>
              <motion.div
                className="w-24 h-1 bg-white mt-8 mb-10"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.6 }}
                viewport={{ once: true }}
              />
              <motion.p
                className="font-['Helvetica_Neue'] text-gray-300 text-xl md:text-2xl max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.8 }}
                viewport={{ once: true }}
              >
                Creating meaningful digital experiences through thoughtful design and innovative technology.
              </motion.p>
            </motion.div>

            {/* Main content - Asymmetric layout */}
            <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
              <motion.div
                className="lg:w-3/5 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                viewport={{ once: true }}
              >
                <p className={`${clashDisplay.className} text-white text-xl md:text-2xl leading-relaxed mb-12`}>
                  I&apos;m <span className="text-white font-bold">Khushi</span>, a UX/UI Designer driven by a passion for crafting user-centric digital experiences that are both functional and beautifully engaging.
                  My design journey is a blend of formal education and self-directed learning, giving me a unique perspective grounded in design principles.
                </p>
                <p className={`${clashDisplay.className} text-gray-300 text-xl md:text-2xl leading-relaxed mb-12`}>
                  With a Bachelor of Design in UI/UX and currently pursuing a Bachelor of Computer Applications, I bridge the gap between aesthetics and functionality.
                  I believe great design is not just about visual appeal; it&apos;s about solving real user problems with empathy and creativity.
                </p>
                <p className={`${clashDisplay.className} text-gray-300 text-xl md:text-2xl leading-relaxed`}>
                  Beyond the digital realm, my inspiration is drawn from museums, art galleries, and the rich history of arts and crafts. 
                  I believe a strong sense of color and genuine empathy are foundational to impactful design.
                </p>

                {/* Signature */}
                <motion.div
                  className="mt-16 inline-block"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="font-[&apos;Helvetica_Neue&apos;] text-white text-3xl font-light italic">Khushi</div>
                  <div className="w-40 h-px bg-gradient-to-r from-white to-transparent mt-2"></div>
                </motion.div>
              </motion.div>

              <motion.div
                className="lg:w-2/5 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="sticky top-32 space-y-12">
                  <div className="relative overflow-hidden">
                    <div className="relative bg-black/40 backdrop-blur-md p-8 border border-white/10">
                      <h4 className={`${clashDisplay.className} text-white text-2xl font-bold uppercase mb-6 flex items-center`}>
                        <span className="w-8 h-px bg-white mr-4"></span>
                        Experience
                      </h4>
                      <p className={`${clashDisplay.className} text-white text-xl`}>UI/UX Designer at Renivet</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <div className="relative bg-black/40 backdrop-blur-md p-8 border border-white/10">
                      <h4 className={`${clashDisplay.className} text-white text-2xl font-bold uppercase mb-6 flex items-center`}>
                        <span className="w-8 h-px bg-white mr-4"></span>
                        Projects
                      </h4>
                      <p className={`${clashDisplay.className} text-white text-xl`}>4 featured design projects</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </div>


      </main>

      <footer className="bg-[#0a0a0a] py-20 px-8 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto">
          {/* Logo and main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            {/* Logo and tagline */}
            <div className="md:col-span-5">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 border border-white/20 mr-4 flex items-center justify-center">
                  <span className="font-['Helvetica_Neue'] text-white text-xl font-bold">K</span>
                </div>
                <div className="font-['Helvetica_Neue'] text-white text-2xl font-bold tracking-tight uppercase">Khushi</div>
              </div>
              <p className="font-['Helvetica_Neue'] text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
                Creating innovative digital experiences that blend creativity with functionality.
              </p>
            </div>

            <div className="md:col-span-7 flex flex-col items-center">
              {/* Quick Links */}
              <div className="w-full flex justify-center mb-16">
                <div className="text-center">
                  <h3 className={`${clashDisplay.className} text-white text-xl font-bold uppercase mb-8 text-center`}>Quick Links</h3>
                  <ul className="space-y-4 text-center">
                    <li><a href="#" className={`${clashDisplay.className} text-gray-400 hover:text-white transition-colors duration-500 text-lg`}>Home</a></li>
                    <li><a href="#" className={`${clashDisplay.className} text-gray-400 hover:text-white transition-colors duration-500 text-lg`}>Works</a></li>
                    <li><a href="#" className={`${clashDisplay.className} text-gray-400 hover:text-white transition-colors duration-500 text-lg`}>About</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-10 border-t border-white/10 flex justify-center items-center">
            <div className={`${clashDisplay.className} text-gray-500 text-lg`}>&copy; {new Date().getFullYear()} Khushi. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleGallery;
