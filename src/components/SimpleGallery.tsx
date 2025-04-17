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
  const contactRef = useRef<HTMLDivElement>(null);

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
        <div className={`${playfair.className} text-white text-xl font-medium tracking-wider`}>Chirantan Bhardwaj</div>
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
          <button
            onClick={() => scrollToSection(contactRef)}
            className={`${clashDisplay.className} text-white text-lg font-light hover:text-gray-300 transition-colors`}
          >
            Contact
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
                  I&apos;m <span className="text-white font-bold">Chirantan Bhardwaj</span>, an entrepreneur and creative professional with a passion for building innovative solutions.
                  With expertise in design, technology, and business strategy, I help brands and organizations create meaningful digital experiences.
                </p>
                <p className={`${clashDisplay.className} text-gray-300 text-xl md:text-2xl leading-relaxed mb-12`}>
                  My approach combines strategic thinking with creative execution, ensuring that every project not only looks beautiful
                  but also delivers tangible results.
                </p>
                <p className={`${clashDisplay.className} text-gray-300 text-xl md:text-2xl leading-relaxed`}>
                  I believe in the power of thoughtful design and cutting-edge technology to solve complex problems. My goal is to create digital experiences that not only look stunning but also provide intuitive, meaningful interactions that resonate with users and achieve business objectives.
                </p>

                {/* Signature */}
                <motion.div
                  className="mt-16 inline-block"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="font-[&apos;Helvetica_Neue&apos;] text-white text-3xl font-light italic">Chirantan</div>
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
                      <p className={`${clashDisplay.className} text-white text-xl`}>10+ years in digital design & development</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <div className="relative bg-black/40 backdrop-blur-md p-8 border border-white/10">
                      <h4 className={`${clashDisplay.className} text-white text-2xl font-bold uppercase mb-6 flex items-center`}>
                        <span className="w-8 h-px bg-white mr-4"></span>
                        Projects
                      </h4>
                      <p className={`${clashDisplay.className} text-white text-xl`}>100+ successful projects delivered</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <div className="relative bg-black/40 backdrop-blur-md p-8 border border-white/10">
                      <h4 className={`${clashDisplay.className} text-white text-2xl font-bold uppercase mb-6 flex items-center`}>
                        <span className="w-8 h-px bg-white mr-4"></span>
                        Clients
                      </h4>
                      <p className={`${clashDisplay.className} text-white text-xl`}>From startups to Fortune 500 companies</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div ref={contactRef} className="min-h-screen w-full bg-[#0a0a0a] px-8 py-24 relative overflow-hidden">
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
                className={`${clashDisplay.className} text-white text-7xl md:text-[10rem] font-bold tracking-tighter leading-[0.9] uppercase`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
                viewport={{ once: true }}
              >
                CONTACT
              </motion.h2>
              <motion.div
                className="w-24 h-1 bg-white mt-8 mb-10"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.6 }}
                viewport={{ once: true }}
              />
              <motion.p
                className="font-[&apos;Helvetica_Neue&apos;] text-gray-300 text-xl md:text-2xl max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.8 }}
                viewport={{ once: true }}
              >
                Let&apos;s create something amazing together. I&apos;m always open to discussing new projects, creative ideas or opportunities.
              </motion.p>
            </motion.div>

            {/* Asymmetric layout for contact info and form */}
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
              {/* Left column - Contact information */}
              <motion.div
                className="lg:w-2/5 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                viewport={{ once: true }}
              >
                <div className="sticky top-32 space-y-16">
                  <div>
                    <motion.h3
                      className={`${clashDisplay.className} text-white text-3xl font-bold uppercase mb-12 inline-block relative`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <span className="absolute -bottom-3 left-0 w-16 h-0.5 bg-white"></span>
                      Contact Details
                    </motion.h3>

                    <div className="space-y-12 mt-10">
                      {[
                        {
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ),
                          title: "Email",
                          content: "hello@chirantanbhardwaj.com",
                          href: "mailto:hello@chirantanbhardwaj.com"
                        },
                        {
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          ),
                          title: "LinkedIn",
                          content: "linkedin.com/in/chirantanbhardwaj",
                          href: "https://linkedin.com/in/chirantanbhardwaj"
                        },
                        {
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          ),
                          title: "Twitter",
                          content: "twitter.com/chirantanb",
                          href: "https://twitter.com/chirantanb"
                        }
                      ].map((item, i) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.4 + (i * 0.1) }}
                          viewport={{ once: true }}
                          className="group"
                        >
                          <div className="flex items-start space-x-6">
                            <div className="text-gray-400 group-hover:text-white transition-colors duration-500">{item.icon}</div>
                            <div>
                              <h4 className={`${clashDisplay.className} text-white text-xl font-bold uppercase mb-2`}>{item.title}</h4>
                              <a
                                href={item.href}
                                target={item.href.startsWith("mailto") ? "_self" : "_blank"}
                                rel={item.href.startsWith("mailto") ? "" : "noopener noreferrer"}
                                className={`${clashDisplay.className} text-gray-400 hover:text-white transition-colors duration-500 border-b border-transparent hover:border-white/30 inline-block text-lg`}
                              >
                                {item.content}
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.7 }}
                    viewport={{ once: true }}
                    className="mt-16 relative overflow-hidden"
                  >
                    <div className="relative bg-black/40 backdrop-blur-md p-8 border border-white/10">
                      <h4 className={`${clashDisplay.className} text-white text-2xl font-bold uppercase mb-6 flex items-center`}>
                        <span className="w-8 h-px bg-white mr-4"></span>
                        Working Hours
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <p className={`${clashDisplay.className} text-gray-400 text-lg`}>Monday - Friday</p>
                          <p className={`${clashDisplay.className} text-white text-lg`}>9am - 6pm</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-['Helvetica_Neue'] text-gray-400 text-lg">Weekend</p>
                          <p className="font-['Helvetica_Neue'] text-white text-lg">By appointment</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right column - Contact form */}
              <motion.div
                className="lg:w-3/5 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.h3
                  className="font-['Helvetica_Neue'] text-white text-3xl font-bold uppercase mb-12 inline-block relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <span className="absolute -bottom-3 left-0 w-16 h-0.5 bg-white"></span>
                  Start a Project
                </motion.h3>

                <motion.p
                  className="font-[&apos;Helvetica_Neue&apos;] text-gray-300 text-xl mb-16 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                </motion.p>

                <div className="relative overflow-hidden">
                  <div className="relative bg-black/20 backdrop-blur-sm p-10 border border-white/10">
                    <form className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                          { id: "name", label: "NAME", type: "text", placeholder: "Your name", cols: "md:col-span-1" },
                          { id: "email", label: "EMAIL", type: "email", placeholder: "Your email address", cols: "md:col-span-1" },
                          { id: "subject", label: "SUBJECT", type: "text", placeholder: "Project subject", cols: "md:col-span-2" }
                        ].map((field, i) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.5 + (i * 0.1) }}
                            viewport={{ once: true }}
                            className={`${field.cols} relative group`}
                          >
                            <label
                              htmlFor={field.id}
                              className="font-['Helvetica_Neue'] text-white text-sm font-bold absolute -top-6 left-0 transition-all duration-500 group-focus-within:text-white"
                            >
                              {field.label}
                            </label>
                            <div className="relative">
                              <input
                                type={field.type}
                                id={field.id}
                                placeholder={field.placeholder}
                                className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-white transition-colors duration-500 placeholder-gray-500 font-['Helvetica_Neue'] text-lg"
                              />
                              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-focus-within:w-full transition-all duration-700"></div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.8 }}
                        viewport={{ once: true }}
                        className="relative group"
                      >
                        <label
                          htmlFor="message"
                          className="font-['Helvetica_Neue'] text-white text-sm font-bold absolute -top-6 left-0 transition-all duration-500 group-focus-within:text-white"
                        >
                          MESSAGE
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            rows={5}
                            placeholder="Tell me about your project"
                            className="w-full bg-transparent border-b border-white/30 py-3 text-white focus:outline-none focus:border-white transition-colors duration-500 placeholder-gray-500 resize-none font-['Helvetica_Neue'] text-lg"
                          ></textarea>
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-focus-within:w-full transition-all duration-700"></div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.9 }}
                        viewport={{ once: true }}
                        className="pt-6"
                      >
                        <motion.button
                          className="group relative overflow-hidden bg-transparent border border-white text-white px-10 py-4 font-['Helvetica_Neue'] font-bold text-lg uppercase tracking-wider transition-all duration-700"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-3 transition-transform duration-700 group-hover:translate-x-2">
                            Send Message
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform duration-700 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                          <span className="absolute left-0 top-0 h-full w-0 bg-white transition-all duration-700 group-hover:w-full"></span>
                          <span className="absolute left-0 top-0 h-full w-0 bg-white opacity-30 transition-all duration-700 delay-100 group-hover:w-full"></span>
                        </motion.button>
                      </motion.div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Final call to action section removed */}
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
                  <span className="font-['Helvetica_Neue'] text-white text-xl font-bold">CB</span>
                </div>
                <div className="font-['Helvetica_Neue'] text-white text-2xl font-bold tracking-tight uppercase">Chirantan Bhardwaj</div>
              </div>
              <p className="font-['Helvetica_Neue'] text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
                Creating innovative digital experiences that blend creativity with functionality.
              </p>
              <div className="flex space-x-6 mb-6">
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
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
                    <li><a href="#" className={`${clashDisplay.className} text-gray-400 hover:text-white transition-colors duration-500 text-lg`}>Contact</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-10 border-t border-white/10 flex justify-center items-center">
            <div className={`${clashDisplay.className} text-gray-500 text-lg`}>&copy; {new Date().getFullYear()} Chirantan Bhardwaj. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleGallery;
