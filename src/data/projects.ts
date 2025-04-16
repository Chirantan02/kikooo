export interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: 1,
    image: "/projects/project1.jpg",
    title: "Portfolio Website",
    description: "A modern, interactive portfolio website built with Next.js and Framer Motion."
  },
  {
    id: 2,
    image: "/projects/project2.jpg",
    title: "E-Commerce Platform",
    description: "A full-featured online shopping platform with secure payment processing."
  },
  {
    id: 3,
    image: "/projects/project3.jpg",
    title: "Mobile App",
    description: "A cross-platform mobile application built with React Native."
  },
  {
    id: 4,
    image: "/projects/project4.jpg",
    title: "AI Assistant",
    description: "An intelligent virtual assistant powered by machine learning algorithms."
  },
  {
    id: 5,
    image: "/projects/project5.jpg",
    title: "Blockchain Solution",
    description: "A decentralized application built on blockchain technology."
  },
  {
    id: 6,
    image: "/projects/project6.jpg",
    title: "IoT Platform",
    description: "An Internet of Things platform for connecting and managing smart devices."
  }
];