import * as cheerio from 'cheerio';

export interface ExtractedImage {
  url: string;
  alt?: string;
  type: 'project' | 'profile' | 'background' | 'icon' | 'other';
  context?: string;
}

export interface ImageExtractionResult {
  images: ExtractedImage[];
  projectImages: Record<string, string[]>;
  profileImages: {
    avatar?: string;
    hero?: string;
    background?: string;
  };
}

/**
 * Extracts image URLs from HTML content
 */
export class ImageExtractor {
  
  /**
   * Extracts all images from HTML content
   */
  extractImagesFromHtml(html: string, baseUrl: string): ExtractedImage[] {
    const $ = cheerio.load(html);
    const images: ExtractedImage[] = [];
    
    $('img').each((_, element) => {
      const $img = $(element);
      let src = $img.attr('src');
      
      if (!src) return;
      
      // Convert relative URLs to absolute
      if (src.startsWith('/')) {
        src = new URL(src, baseUrl).href;
      } else if (!src.startsWith('http')) {
        src = new URL(src, baseUrl).href;
      }
      
      const alt = $img.attr('alt') || '';
      const context = this.getImageContext($img, $);
      const type = this.classifyImage(src, alt, context);
      
      images.push({
        url: src,
        alt,
        type,
        context
      });
    });
    
    // Also check for background images in CSS
    const backgroundImages = this.extractBackgroundImages(html, baseUrl);
    images.push(...backgroundImages);
    
    return images;
  }
  
  /**
   * Classifies image type based on URL, alt text, and context
   */
  private classifyImage(url: string, alt: string, context: string): ExtractedImage['type'] {
    const urlLower = url.toLowerCase();
    const altLower = alt.toLowerCase();
    const contextLower = context.toLowerCase();
    
    // Profile/avatar images
    if (altLower.includes('avatar') || altLower.includes('profile') || 
        urlLower.includes('avatar') || urlLower.includes('profile')) {
      return 'profile';
    }
    
    // Hero/banner images
    if (altLower.includes('hero') || altLower.includes('banner') ||
        contextLower.includes('hero') || contextLower.includes('banner')) {
      return 'background';
    }
    
    // Project images
    if (altLower.includes('project') || urlLower.includes('project') ||
        contextLower.includes('project') || contextLower.includes('portfolio')) {
      return 'project';
    }
    
    // Icons
    if (urlLower.includes('icon') || urlLower.includes('logo') ||
        altLower.includes('icon') || altLower.includes('logo')) {
      return 'icon';
    }
    
    return 'other';
  }
  
  /**
   * Gets context information about where the image appears
   */
  private getImageContext($img: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
    const contexts: string[] = [];
    
    // Check parent elements for context clues
    const $parent = $img.parent();
    const parentClass = $parent.attr('class') || '';
    const parentId = $parent.attr('id') || '';
    
    contexts.push(parentClass, parentId);
    
    // Check for nearby text content
    const nearbyText = $parent.text().trim().substring(0, 100);
    if (nearbyText) {
      contexts.push(nearbyText);
    }
    
    // Check section or article containers
    const $section = $img.closest('section, article, div[class*="project"], div[class*="portfolio"]');
    if ($section.length) {
      const sectionClass = $section.attr('class') || '';
      const sectionId = $section.attr('id') || '';
      contexts.push(sectionClass, sectionId);
    }
    
    return contexts.filter(Boolean).join(' ');
  }
  
  /**
   * Extracts background images from CSS styles
   */
  private extractBackgroundImages(html: string, baseUrl: string): ExtractedImage[] {
    const images: ExtractedImage[] = [];
    const $ = cheerio.load(html);
    
    // Check inline styles
    $('[style*="background"]').each((_, element) => {
      const style = $(element).attr('style') || '';
      const matches = style.match(/background(?:-image)?:\s*url\(['"]?([^'")\s]+)['"]?\)/gi);
      
      if (matches) {
        matches.forEach(match => {
          const urlMatch = match.match(/url\(['"]?([^'")\s]+)['"]?\)/);
          if (urlMatch) {
            let url = urlMatch[1];
            
            // Convert relative URLs to absolute
            if (url.startsWith('/')) {
              url = new URL(url, baseUrl).href;
            } else if (!url.startsWith('http')) {
              url = new URL(url, baseUrl).href;
            }
            
            images.push({
              url,
              type: 'background',
              context: 'CSS background-image'
            });
          }
        });
      }
    });
    
    return images;
  }
  
  /**
   * Organizes extracted images by type and context
   */
  organizeExtractedImages(images: ExtractedImage[]): ImageExtractionResult {
    const projectImages: Record<string, string[]> = {};
    const profileImages: ImageExtractionResult['profileImages'] = {};
    
    images.forEach(image => {
      switch (image.type) {
        case 'project':
          // Try to group project images by context or URL patterns
          const projectKey = this.extractProjectKey(image);
          if (!projectImages[projectKey]) {
            projectImages[projectKey] = [];
          }
          projectImages[projectKey].push(image.url);
          break;
          
        case 'profile':
          if (!profileImages.avatar) {
            profileImages.avatar = image.url;
          }
          break;
          
        case 'background':
          if (image.context?.toLowerCase().includes('hero')) {
            profileImages.hero = image.url;
          } else {
            profileImages.background = image.url;
          }
          break;
      }
    });
    
    return {
      images,
      projectImages,
      profileImages
    };
  }
  
  /**
   * Extracts a project key from image context
   */
  private extractProjectKey(image: ExtractedImage): string {
    const context = image.context?.toLowerCase() || '';
    const url = image.url.toLowerCase();
    
    // Look for project identifiers in context or URL
    const projectMatch = context.match(/project[_-]?(\d+|[a-z]+)/);
    if (projectMatch) {
      return `project-${projectMatch[1]}`;
    }
    
    const urlMatch = url.match(/project[_-]?(\d+|[a-z]+)/);
    if (urlMatch) {
      return `project-${urlMatch[1]}`;
    }
    
    // Fallback to a generic key based on order
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}