import path from 'path';
import { ImageDownloadConfig } from './image-downloader';

export interface ProjectImageConfig {
  projectId: string;
  projectName: string;
  images: {
    main?: string;
    thumbnails?: string[];
    gallery?: string[];
  };
}

export interface ProfileImageConfig {
  avatar?: string;
  hero?: string;
  background?: string;
}

/**
 * Creates organized directory structure for images
 */
export class ImageOrganizer {
  private publicDir: string;
  
  constructor(publicDir: string = 'public') {
    this.publicDir = publicDir;
  }
  
  /**
   * Creates the complete directory structure for organized image storage
   */
  createDirectoryStructure(): void {
    const directories = [
      path.join(this.publicDir, 'images'),
      path.join(this.publicDir, 'images', 'profile'),
      path.join(this.publicDir, 'images', 'projects'),
      path.join(this.publicDir, 'images', 'gallery'),
      path.join(this.publicDir, 'icons')
    ];
    
    const fs = require('fs');
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
  }
  
  /**
   * Generates download configs for project images
   */
  generateProjectImageConfigs(projectConfigs: ProjectImageConfig[]): ImageDownloadConfig[] {
    const configs: ImageDownloadConfig[] = [];
    
    projectConfigs.forEach(project => {
      const projectDir = path.join(this.publicDir, 'images', 'projects', project.projectId);
      
      // Main project image
      if (project.images.main) {
        configs.push({
          url: project.images.main,
          filename: 'main.jpg',
          directory: projectDir
        });
      }
      
      // Thumbnail images
      if (project.images.thumbnails) {
        const thumbnailDir = path.join(projectDir, 'thumbnails');
        project.images.thumbnails.forEach((url, index) => {
          const extension = this.getFileExtension(url);
          configs.push({
            url,
            filename: `thumb-${index + 1}.${extension}`,
            directory: thumbnailDir
          });
        });
      }
      
      // Gallery images
      if (project.images.gallery) {
        const galleryDir = path.join(projectDir, 'gallery');
        project.images.gallery.forEach((url, index) => {
          const extension = this.getFileExtension(url);
          configs.push({
            url,
            filename: `gallery-${index + 1}.${extension}`,
            directory: galleryDir
          });
        });
      }
    });
    
    return configs;
  }
  
  /**
   * Generates download configs for profile images
   */
  generateProfileImageConfigs(profileConfig: ProfileImageConfig): ImageDownloadConfig[] {
    const configs: ImageDownloadConfig[] = [];
    const profileDir = path.join(this.publicDir, 'images', 'profile');
    
    if (profileConfig.avatar) {
      configs.push({
        url: profileConfig.avatar,
        filename: 'avatar.jpg',
        directory: profileDir
      });
    }
    
    if (profileConfig.hero) {
      configs.push({
        url: profileConfig.hero,
        filename: 'hero.jpg',
        directory: profileDir
      });
    }
    
    if (profileConfig.background) {
      configs.push({
        url: profileConfig.background,
        filename: 'hero-bg.jpg',
        directory: profileDir
      });
    }
    
    return configs;
  }
  
  /**
   * Gets file extension from URL
   */
  private getFileExtension(url: string): string {
    const urlPath = new URL(url).pathname;
    const extension = path.extname(urlPath).slice(1);
    return extension || 'jpg'; // Default to jpg if no extension found
  }
  
  /**
   * Generates relative paths for use in the application
   */
  getProjectImagePath(projectId: string, imageType: 'main' | 'thumbnail' | 'gallery', index?: number): string {
    const basePath = `/images/projects/${projectId}`;
    
    switch (imageType) {
      case 'main':
        return `${basePath}/main.jpg`;
      case 'thumbnail':
        return `${basePath}/thumbnails/thumb-${index || 1}.jpg`;
      case 'gallery':
        return `${basePath}/gallery/gallery-${index || 1}.jpg`;
      default:
        return `${basePath}/main.jpg`;
    }
  }
  
  /**
   * Generates relative paths for profile images
   */
  getProfileImagePath(imageType: 'avatar' | 'hero' | 'background'): string {
    const basePath = '/images/profile';
    
    switch (imageType) {
      case 'avatar':
        return `${basePath}/avatar.jpg`;
      case 'hero':
        return `${basePath}/hero.jpg`;
      case 'background':
        return `${basePath}/hero-bg.jpg`;
      default:
        return `${basePath}/avatar.jpg`;
    }
  }
}