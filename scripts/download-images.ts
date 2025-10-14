#!/usr/bin/env tsx

import { downloadImages } from '../src/lib/image-downloader';
import { ImageOrganizer, ProjectImageConfig, ProfileImageConfig } from '../src/lib/image-organizer';

/**
 * Script to download and organize images from the old portfolio
 * This script should be run after content extraction to download all identified images
 */

async function main() {
  console.log('Starting image download and organization...');
  
  // Initialize the image organizer
  const organizer = new ImageOrganizer();
  
  // Create directory structure
  console.log('Creating directory structure...');
  organizer.createDirectoryStructure();
  
  // Example configuration - this would be populated from the content extraction
  // For now, we'll create a template structure that can be filled in later
  
  const exampleProjectConfigs: ProjectImageConfig[] = [
    {
      projectId: 'project-1',
      projectName: 'Example Project 1',
      images: {
        main: 'https://example.com/project1-main.jpg',
        thumbnails: [
          'https://example.com/project1-thumb1.jpg',
          'https://example.com/project1-thumb2.jpg'
        ],
        gallery: [
          'https://example.com/project1-gallery1.jpg',
          'https://example.com/project1-gallery2.jpg'
        ]
      }
    }
    // More projects would be added here from the extracted data
  ];
  
  const exampleProfileConfig: ProfileImageConfig = {
    avatar: 'https://example.com/avatar.jpg',
    hero: 'https://example.com/hero.jpg',
    background: 'https://example.com/hero-bg.jpg'
  };
  
  try {
    // Generate download configurations
    const projectImageConfigs = organizer.generateProjectImageConfigs(exampleProjectConfigs);
    const profileImageConfigs = organizer.generateProfileImageConfigs(exampleProfileConfig);
    
    const allConfigs = [...projectImageConfigs, ...profileImageConfigs];
    
    if (allConfigs.length === 0) {
      console.log('No images to download. Please update the configuration with actual URLs.');
      return;
    }
    
    console.log(`Downloading ${allConfigs.length} images...`);
    
    // Download all images
    const results = await downloadImages(allConfigs, 3);
    
    // Report results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\nDownload complete:`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed downloads:');
      results.forEach((result, index) => {
        if (!result.success) {
          console.log(`- ${allConfigs[index].url}: ${result.error}`);
        }
      });
    }
    
    console.log('\nImage organization complete!');
    console.log('Directory structure created at:');
    console.log('- public/images/profile/');
    console.log('- public/images/projects/');
    console.log('- public/images/gallery/');
    
  } catch (error) {
    console.error('Error during image download:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main as downloadImagesScript };