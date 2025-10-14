export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'tools';
  proficiency?: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skills: Skill[] = [
  // Design Skills
  {
    "name": "UI Design",
    "category": "design",
    "proficiency": 90
  },
  {
    "name": "UX Research",
    "category": "design",
    "proficiency": 85
  },
  {
    "name": "Mobile App Design",
    "category": "design",
    "proficiency": 88
  },
  {
    "name": "Web Design",
    "category": "design",
    "proficiency": 85
  },
  {
    "name": "VR Design",
    "category": "design",
    "proficiency": 75
  },
  {
    "name": "Visual Design",
    "category": "design",
    "proficiency": 90
  },
  {
    "name": "Color Theory",
    "category": "design",
    "proficiency": 92
  },
  {
    "name": "Typography",
    "category": "design",
    "proficiency": 88
  },
  {
    "name": "Brand Design",
    "category": "design",
    "proficiency": 80
  },
  {
    "name": "AI Integration",
    "category": "design",
    "proficiency": 75
  },
  // Tools
  {
    "name": "Figma",
    "category": "tools",
    "proficiency": 95
  },
  {
    "name": "Adobe Photoshop",
    "category": "tools",
    "proficiency": 85
  },
  {
    "name": "Adobe Illustrator",
    "category": "tools",
    "proficiency": 80
  },
  {
    "name": "Adobe XD",
    "category": "tools",
    "proficiency": 75
  },
  {
    "name": "Prototyping",
    "category": "tools",
    "proficiency": 90
  },
  {
    "name": "Wireframing",
    "category": "tools",
    "proficiency": 92
  },
  {
    "name": "User Testing",
    "category": "tools",
    "proficiency": 80
  },
  {
    "name": "Design Systems",
    "category": "tools",
    "proficiency": 85
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: skills.filter(skill => skill.category === 'frontend')
  },
  {
    name: "Backend", 
    skills: skills.filter(skill => skill.category === 'backend')
  },
  {
    name: "Design",
    skills: skills.filter(skill => skill.category === 'design')
  },
  {
    name: "Tools",
    skills: skills.filter(skill => skill.category === 'tools')
  }
];
