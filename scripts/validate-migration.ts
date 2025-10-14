#!/usr/bin/env tsx

import { projects } from '../src/data/projects';
import { personalInfo } from '../src/data/personal';
import { skills } from '../src/data/skills';

function validateMigration() {
  console.log('🔍 Validating migrated content...\n');
  
  let isValid = true;
  
  // Validate projects
  console.log('📊 Projects Validation:');
  if (projects.length === 0) {
    console.log('❌ No projects found');
    isValid = false;
  } else {
    console.log(`✅ Found ${projects.length} projects`);
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
      if (!project.image) {
        console.log(`      ⚠️  Missing image`);
      }
      if (!project.description) {
        console.log(`      ⚠️  Missing description`);
      }
      if (project.technologies && project.technologies.length > 0) {
        console.log(`      🛠️  Technologies: ${project.technologies.join(', ')}`);
      }
      if (project.liveUrl) {
        console.log(`      🔗 Live URL: ${project.liveUrl}`);
      }
    });
  }
  
  // Validate personal info
  console.log('\n👤 Personal Info Validation:');
  if (!personalInfo.name || personalInfo.name === 'Your Name') {
    console.log('❌ Name not properly extracted');
    isValid = false;
  } else {
    console.log(`✅ Name: ${personalInfo.name}`);
  }
  
  if (!personalInfo.title || personalInfo.title === 'Your Professional Title') {
    console.log('❌ Title not properly extracted');
    isValid = false;
  } else {
    console.log(`✅ Title: ${personalInfo.title}`);
  }
  
  if (!personalInfo.bio || personalInfo.bio === 'Your professional bio will be migrated here.') {
    console.log('❌ Bio not properly extracted');
    isValid = false;
  } else {
    console.log(`✅ Bio: ${personalInfo.bio.substring(0, 100)}...`);
  }
  
  if (!personalInfo.email || personalInfo.email === 'your.email@example.com') {
    console.log('❌ Email not properly extracted');
    isValid = false;
  } else {
    console.log(`✅ Email: ${personalInfo.email}`);
  }
  
  if (personalInfo.socialLinks.linkedin) {
    console.log(`✅ LinkedIn: ${personalInfo.socialLinks.linkedin}`);
  }
  
  // Validate skills
  console.log('\n🛠️ Skills Validation:');
  if (skills.length === 0) {
    console.log('❌ No skills found');
    isValid = false;
  } else {
    console.log(`✅ Found ${skills.length} skills`);
    const categories = [...new Set(skills.map(s => s.category))];
    categories.forEach(category => {
      const categorySkills = skills.filter(s => s.category === category);
      console.log(`   ${category}: ${categorySkills.map(s => s.name).join(', ')}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  if (isValid) {
    console.log('🎉 Migration validation passed! Content is ready to use.');
  } else {
    console.log('⚠️  Migration validation found issues. Please review the extracted content.');
  }
  
  return isValid;
}

validateMigration();