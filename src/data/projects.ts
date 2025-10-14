export interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
}

export const projects: Project[] = [
  {
    "id": 4,
    "image": "/images/flow/flow.png",
    "title": "FlowPay",
    "description": "Innovative payment solution for seamless digital transactions with enhanced security and user experience.",
    "technologies": [
      "UI/UX Design",
      "Figma",
      "Prototyping",
      "User Research",
      "Payment Systems"
    ],
    "liveUrl": "https://www.behance.net/gallery/236154181/flowpay",
    "category": "FinTech"
  },
  {
    "id": 1,
    "image": "/images/home/HYPD.png",
    "title": "HYPD",
    "description": "Revolutionary e-commerce platform empowering creators to monetize their influence through personalized shopping experiences. The Blink-it for Fashion.",
    "technologies": [
      "UI/UX Design",
      "Mobile App Design",
      "Figma",
      "Prototyping",
      "User Experience Innovation"
    ],
    "liveUrl": "https://www.behance.net/gallery/220731875/HYPD-The-Blink-it-for-Fashion-",
    "category": "E-commerce App"
  },
  {
    "id": 2,
    "image": "/images/home/AERO.png",
    "title": "AERO",
    "description": "Reimagining the future of air travel through intuitive design and seamless user experiences. VR & AI-powered airport navigation making travel stress-free.",
    "technologies": [
      "UI/UX Design",
      "VR Design",
      "AI Integration",
      "Figma",
      "Real-time Tracking"
    ],
    "liveUrl": "https://www.behance.net/gallery/220730085/AERO-Revolutionizing-Airport-Travel-with-VR-AI",
    "category": "VR/AI Experience"
  },
  {
    "id": 3,
    "image": "/images/home/GREENCLOZ.jpg",
    "title": "GREENCLOZ",
    "description": "Sustainable fashion platform that connects eco-conscious consumers with ethical fashion choices. Your Digital Wardrobe for sustainable living.",
    "technologies": [
      "UI/UX Design",
      "Web Design",
      "Figma",
      "User Research",
      "Sustainable Design"
    ],
    "liveUrl": "https://www.behance.net/gallery/220735589/GreenCloz-Your-Digital-Wardrobe",
    "category": "Lifestyle App"
  }
];
