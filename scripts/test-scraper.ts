#!/usr/bin/env tsx

import { ContentExtractor } from '../src/lib/content-extractor';

async function testScraper() {
  console.log('Testing content extractor...');
  
  const extractor = new ContentExtractor({
    baseUrl: 'https://khushi-beige.vercel.app/',
    timeout: 15000,
    retryAttempts: 3,
    retryDelay: 2000
  });

  try {
    console.log('\n=== Testing Project Extraction ===');
    const projects = await extractor.extractProjects();
    console.log(`Found ${projects.length} projects:`);
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Description: ${project.description.substring(0, 100)}...`);
      console.log(`   Image: ${project.image}`);
      console.log(`   Technologies: ${project.technologies?.join(', ') || 'None'}`);
      console.log('');
    });

    console.log('\n=== Testing Personal Info Extraction ===');
    const personalInfo = await extractor.extractPersonalInfo();
    console.log('Personal Info:', personalInfo);

    console.log('\n=== Testing Skills Extraction ===');
    const skills = await extractor.extractSkills();
    console.log(`Found ${skills.length} skills:`);
    skills.forEach(skill => {
      console.log(`- ${skill.name} (${skill.category}${skill.proficiency ? `, ${skill.proficiency}%` : ''})`);
    });

    console.log('\n=== Testing Image Extraction ===');
    const images = await extractor.extractImages();
    console.log(`Found ${images.length} images:`);
    images.slice(0, 10).forEach((image, index) => {
      console.log(`${index + 1}. ${image.type}: ${image.url} -> ${image.localPath}`);
    });
    if (images.length > 10) {
      console.log(`... and ${images.length - 10} more images`);
    }

  } catch (error) {
    console.error('Scraping test failed:', error);
  }
}

testScraper();