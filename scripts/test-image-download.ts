#!/usr/bin/env tsx

import { ImageMigration } from '../src/lib/image-migration';
import { ProjectImageConfig, ProfileImageConfig } from '../src/lib/image-organizer';

/**
 * Test script for the image download and organization system
 * Uses placeholder URLs to test the functionality
 */

async function testImageDownload() {
  console.log('Testing image download and organization system...');
  
  const migration = new ImageMigration();
  
  // Test with placeholder/example URLs (these won't actually download)
  const testProjectConfigs: ProjectImageConfig[] = [
    {
      projectId: 'test-project-1',
      projectName: 'Test Project 1',
      images: {
        main: 'https://via.placeholder.com/800x600/0066cc/ffffff?text=Project+1+Main',
        thumbnails: [
          'https://via.placeholder.com/300x200/0066cc/ffffff?text=Project+1+Thumb+1',
          'https://via.placeholder.com/300x200/0066cc/ffffff?text=Project+1+Thumb+2'
        ],
        gallery: [
          'https://via.placeholder.com/600x400/0066cc/ffffff?text=Project+1+Gallery+1'
        ]
      }
    },
    {
      projectId: 'test-project-2',
      projectName: 'Test Project 2',
      images: {
        main: 'https://via.placeholder.com/800x600/cc6600/ffffff?text=Project+2+Main',
        thumbnails: [
          'https://via.placeholder.com/300x200/cc6600/ffffff?text=Project+2+Thumb+1'
        ]
      }
    }
  ];
  
  const testProfileConfig: ProfileImageConfig = {
    avatar: 'https://via.placeholder.com/200x200/666666/ffffff?text=Avatar',
    hero: 'https://via.placeholder.com/1200x800/333333/ffffff?text=Hero+Image',
    background: 'https://via.placeholder.com/1920x1080/999999/ffffff?text=Background'
  };
  
  try {
    const result = await migration.migrateImages(testProjectConfigs, testProfileConfig);
    
    console.log('\n=== Migration Results ===');
    console.log(`Success: ${result.success}`);
    console.log(`Downloaded: ${result.downloadedImages}`);
    console.log(`Failed: ${result.failedImages}`);
    
    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(error => console.log(`- ${error}`));
    }
    
    console.log('\n=== Generated Image Paths ===');
    console.log('Project Images:');
    Object.entries(result.imagePaths.projects).forEach(([id, path]) => {
      console.log(`  ${id}: ${path}`);
    });
    
    console.log('Profile Images:');
    Object.entries(result.imagePaths.profile).forEach(([type, path]) => {
      console.log(`  ${type}: ${path}`);
    });
    
    // Validate migration
    const isValid = migration.validateMigration(result.imagePaths);
    console.log(`\nValidation: ${isValid ? '✅ Passed' : '❌ Failed'}`);
    
    console.log('\n=== Directory Structure Created ===');
    console.log('Check the following directories:');
    console.log('- public/images/profile/');
    console.log('- public/images/projects/test-project-1/');
    console.log('- public/images/projects/test-project-1/thumbnails/');
    console.log('- public/images/projects/test-project-1/gallery/');
    console.log('- public/images/projects/test-project-2/');
    console.log('- public/images/projects/test-project-2/thumbnails/');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testImageDownload().catch(console.error);
}

export { testImageDownload };