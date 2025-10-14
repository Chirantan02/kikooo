#!/usr/bin/env tsx

import { ContentExtractor } from '../src/lib/content-extractor';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function migrateContent() {
  console.log('🚀 Starting content migration from old portfolio...');
  
  const extractor = new ContentExtractor({
    baseUrl: 'https://khushi-beige.vercel.app/',
    timeout: 15000,
    retryAttempts: 3,
    retryDelay: 2000
  });

  try {
    // Extract all content
    console.log('\n📊 Extracting all content...');
    const extractedContent = await extractor.extractAllContent();
    
    // Create backup of existing data files
    console.log('\n💾 Creating backups of existing data files...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = join(process.cwd(), 'backups', timestamp);
    mkdirSync(backupDir, { recursive: true });
    
    // Save extracted content to JSON for review
    console.log('\n📝 Saving extracted content for review...');
    writeFileSync(
      join(backupDir, 'extracted-content.json'),
      JSON.stringify(extractedContent, null, 2)
    );
    
    // Generate new data files
    console.log('\n🔄 Generating new data files...');
    
    // Generate projects.ts
    const projectsContent = `export interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
}

export const projects: Project[] = ${JSON.stringify(extractedContent.projects, null, 2)};
`;
    
    writeFileSync(join(process.cwd(), 'src/data/projects.ts'), projectsContent);
    console.log('✅ Updated src/data/projects.ts');
    
    // Generate personal.ts
    const personalContent = `export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}

export const personalInfo: PersonalInfo = ${JSON.stringify(extractedContent.personalInfo, null, 2)};
`;
    
    writeFileSync(join(process.cwd(), 'src/data/personal.ts'), personalContent);
    console.log('✅ Updated src/data/personal.ts');
    
    // Generate skills.ts
    const skillsContent = `export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'tools';
  proficiency?: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skills: Skill[] = ${JSON.stringify(extractedContent.skills, null, 2)};

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
`;
    
    writeFileSync(join(process.cwd(), 'src/data/skills.ts'), skillsContent);
    console.log('✅ Updated src/data/skills.ts');
    
    // Summary
    console.log('\n📈 Migration Summary:');
    console.log(`   • Projects: ${extractedContent.projects.length}`);
    console.log(`   • Skills: ${extractedContent.skills.length}`);
    console.log(`   • Images: ${extractedContent.images.length}`);
    console.log(`   • Personal Info: ✅`);
    console.log(`   • Backup saved to: ${backupDir}`);
    
    console.log('\n🎉 Content migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review the generated data files');
    console.log('   2. Run the image download script (Task 3)');
    console.log('   3. Update components to use the new data');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateContent();