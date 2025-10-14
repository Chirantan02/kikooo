import { downloadImages, ImageDownloadConfig } from './image-downloader';
import { ImageOrganizer, ProjectImageConfig, ProfileImageConfig } from './image-organizer';

export interface ImageMigrationResult {
  success: boolean;
  downloadedImages: number;
  failedImages: number;
  errors: string[];
  imagePaths: {
    projects: Record<string, string>;
    profile: Record<string, string>;
  };
}

/**
 * Main class for handling image migration from old portfolio to new template
 */
export class ImageMigration {
  private organizer: ImageOrganizer;
  
  constructor(publicDir: string = 'public') {
    this.organizer = new ImageOrganizer(publicDir);
  }
  
  /**
   * Migrates all images from the old portfolio
   */
  async migrateImages(
    projectConfigs: ProjectImageConfig[],
    profileConfig: ProfileImageConfig
  ): Promise<ImageMigrationResult> {
    console.log('Starting image migration...');
    
    // Create directory structure
    this.organizer.createDirectoryStructure();
    
    // Generate download configurations
    const projectImageConfigs = this.organizer.generateProjectImageConfigs(projectConfigs);
    const profileImageConfigs = this.organizer.generateProfileImageConfigs(profileConfig);
    
    const allConfigs = [...projectImageConfigs, ...profileImageConfigs];
    
    if (allConfigs.length === 0) {
      return {
        success: true,
        downloadedImages: 0,
        failedImages: 0,
        errors: [],
        imagePaths: { projects: {}, profile: {} }
      };
    }
    
    // Download all images with retry logic
    const results = await downloadImages(allConfigs, 3);
    
    // Process results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const errors = results
      .filter(r => !r.success)
      .map((r, i) => `${allConfigs[i].url}: ${r.error}`)
      .filter(Boolean);
    
    // Generate image path mappings for the application
    const imagePaths = this.generateImagePaths(projectConfigs, profileConfig);
    
    return {
      success: failed === 0,
      downloadedImages: successful,
      failedImages: failed,
      errors,
      imagePaths
    };
  }
  
  /**
   * Generates image path mappings for use in the application
   */
  private generateImagePaths(
    projectConfigs: ProjectImageConfig[],
    profileConfig: ProfileImageConfig
  ) {
    const projects: Record<string, string> = {};
    const profile: Record<string, string> = {};
    
    // Generate project image paths
    projectConfigs.forEach(project => {
      projects[project.projectId] = this.organizer.getProjectImagePath(project.projectId, 'main');
    });
    
    // Generate profile image paths
    if (profileConfig.avatar) {
      profile.avatar = this.organizer.getProfileImagePath('avatar');
    }
    if (profileConfig.hero) {
      profile.hero = this.organizer.getProfileImagePath('hero');
    }
    if (profileConfig.background) {
      profile.background = this.organizer.getProfileImagePath('background');
    }
    
    return { projects, profile };
  }
  
  /**
   * Validates that required images exist after migration
   */
  validateMigration(imagePaths: { projects: Record<string, string>; profile: Record<string, string> }): boolean {
    const fs = require('fs');
    const path = require('path');
    
    let allValid = true;
    
    // Check project images
    Object.entries(imagePaths.projects).forEach(([projectId, imagePath]) => {
      const fullPath = path.join('public', imagePath);
      if (!fs.existsSync(fullPath)) {
        console.error(`Missing project image: ${fullPath}`);
        allValid = false;
      }
    });
    
    // Check profile images
    Object.entries(imagePaths.profile).forEach(([type, imagePath]) => {
      const fullPath = path.join('public', imagePath);
      if (!fs.existsSync(fullPath)) {
        console.error(`Missing profile image: ${fullPath}`);
        allValid = false;
      }
    });
    
    return allValid;
  }
  
  /**
   * Cleans up old images that are no longer needed
   */
  cleanupOldImages(): void {
    const fs = require('fs');
    const path = require('path');
    
    const oldProjectsDir = path.join('public', 'projects');
    
    if (fs.existsSync(oldProjectsDir)) {
      console.log('Cleaning up old project images...');
      // This would move or backup old images before deletion
      // For safety, we'll just log what would be cleaned up
      const files = fs.readdirSync(oldProjectsDir);
      files.forEach((file: string) => {
        console.log(`Would clean up: ${path.join(oldProjectsDir, file)}`);
      });
    }
  }
}