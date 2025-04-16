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
    image: "/projects/project6.png",
    title: "IoT Platform",
    description: "An Internet of Things platform for connecting and managing smart devices."
  },
  {
    id: 7,
    image: "/projects/project7.jpg",
    title: "Data Visualization",
    description: "Interactive data visualization dashboard for business analytics."
  },
  {
    id: 8,
    image: "/projects/project8.jpg",
    title: "Social Media App",
    description: "A social networking platform with real-time messaging and content sharing."
  },
  {
    id: 9,
    image: "/projects/project9.jpg",
    title: "Educational Platform",
    description: "Online learning platform with interactive courses and assessments."
  }
];