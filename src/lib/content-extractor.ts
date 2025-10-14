import { Project } from '@/data/projects';
import { PersonalInfo } from '@/data/personal';
import { Skill } from '@/data/skills';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';

export interface ExtractedContent {
  projects: Project[];
  personalInfo: PersonalInfo;
  skills: Skill[];
  images: ExtractedImage[];
}

export interface ExtractedImage {
  url: string;
  localPath: string;
  type: 'project' | 'profile' | 'hero' | 'gallery';
  projectId?: number;
}

export interface ScrapingOptions {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class ContentExtractor {
  private options: Required<ScrapingOptions>;

  constructor(options: ScrapingOptions) {
    this.options = {
      baseUrl: options.baseUrl,
      timeout: options.timeout || 10000,
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 1000
    };
  }

  /**
   * Extract all content from the old portfolio
   */
  async extractAllContent(): Promise<ExtractedContent> {
    try {
      console.log(`Starting content extraction from ${this.options.baseUrl}`);
      
      const [projects, personalInfo, skills, images] = await Promise.all([
        this.extractProjects(),
        this.extractPersonalInfo(),
        this.extractSkills(),
        this.extractImages()
      ]);

      return {
        projects,
        personalInfo,
        skills,
        images
      };
    } catch (error) {
      console.error('Failed to extract content:', error);
      throw new Error(`Content extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract project information from the old portfolio
   */
  async extractProjects(): Promise<Project[]> {
    console.log('Extracting projects...');
    
    try {
      const html = await this.fetchWithRetry(this.options.baseUrl);
      const $ = cheerio.load(html);
      const projects: Project[] = [];
      
      // First, try to find projects by looking for project images and their associated content
      const projectImages = $('img').filter((_, el) => {
        const alt = $(el).attr('alt') || '';
        const src = $(el).attr('src') || '';
        // Look for project-specific images (not gallery images or profile images)
        return alt && alt !== 'Gallery Image' && !src.includes('/about/') && 
               !alt.includes('UI/UX Designer') && // Exclude profile image
               (alt.includes('HYPD') || alt.includes('GreenCloz') || alt.includes('Aero') || 
                (src.includes('/home/') && alt.length < 50));
      });
      
      console.log(`Found ${projectImages.length} potential project images`);
      
      if (projectImages.length > 0) {
        projectImages.each((index, element) => {
          const $img = $(element);
          const alt = $img.attr('alt') || '';
          const src = $img.attr('src') || '';
          
          // Find the project container (usually a parent div)
          const $projectContainer = $img.closest('div, section, article').first();
          
          // Look for project title in nearby headings
          let title = alt;
          const nearbyHeading = $projectContainer.find('h1, h2, h3, h4, h5, h6').filter((_, el) => {
            const headingText = $(el).text().trim();
            return headingText.length > 0 && headingText.length < 50;
          }).first();
          
          if (nearbyHeading.length > 0) {
            title = nearbyHeading.text().trim();
          }
          
          // Look for project description
          const description = $projectContainer.find('p').filter((_, el) => {
            const text = $(el).text().trim();
            return text.length > 20; // Only consider substantial paragraphs
          }).first().text().trim();
          
          // Look for project links in the container and nearby elements
          let liveUrl: string | undefined;
          let githubUrl: string | undefined;
          
          // Search in the project container and its siblings
          const searchArea = $projectContainer.add($projectContainer.next()).add($projectContainer.prev());
          const projectLinks = searchArea.find('a[href]');
          
          projectLinks.each((_, linkEl) => {
            const href = $(linkEl).attr('href') || '';
            const linkText = $(linkEl).text().toLowerCase();
            
            if (href.includes('behance.net') || linkText.includes('view') || linkText.includes('project')) {
              liveUrl = href;
            } else if (href.includes('github.com')) {
              githubUrl = href;
            }
          });
          
          // If no links found in container, search globally for project-specific links
          if (!liveUrl && !githubUrl) {
            $('a[href]').each((_, linkEl) => {
              const href = $(linkEl).attr('href') || '';
              const linkText = $(linkEl).text().toLowerCase();
              
              // Check if link is related to this specific project
              if (href.includes('behance.net') && (
                href.toLowerCase().includes(title.toLowerCase()) ||
                linkText.includes(title.toLowerCase()) ||
                linkText.includes('view')
              )) {
                liveUrl = href;
              }
            });
          }
          
          if (title && src) {
            projects.push({
              id: index + 1,
              image: this.resolveUrl(src),
              title,
              description: description || `${title} project showcase`,
              technologies: this.extractTechnologiesFromContext($projectContainer, title),
              liveUrl,
              githubUrl,
              category: this.categorizeProject(title, description)
            });
          }
        });
      }
      
      // If no projects found through images, try alternative approach
      if (projects.length === 0) {
        console.warn('No projects found through images, trying heading-based extraction');
        
        // Look for project headings and their associated content
        $('h3').each((index, element) => {
          const $heading = $(element);
          const title = $heading.text().trim();
          
          // Check if this looks like a project title
          if (title && title.length > 2 && title.length < 50 && 
              (title.includes('HYPD') || title.includes('GreenCloz') || title.includes('Aero') || 
               title.match(/^[A-Z][a-zA-Z\s]+$/))) {
            
            const $container = $heading.closest('div, section').first();
            
            // Look for associated image
            const $image = $container.find('img').first();
            const imageSrc = $image.attr('src');
            
            // Look for description
            const description = $container.find('p').first().text().trim();
            
            // Look for links
            const $link = $container.find('a[href]').first();
            const liveUrl = $link.attr('href');
            
            if (imageSrc) {
              projects.push({
                id: index + 1,
                image: this.resolveUrl(imageSrc),
                title,
                description: description || `${title} project showcase`,
                technologies: this.extractTechnologiesFromContext($container, title),
                liveUrl,
                category: this.categorizeProject(title, description)
              });
            }
          }
        });
      }
      
      console.log(`Successfully extracted ${projects.length} projects`);
      return projects;
      
    } catch (error) {
      console.error('Failed to extract projects:', error);
      throw new Error(`Project extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract personal information and bio content
   */
  async extractPersonalInfo(): Promise<PersonalInfo> {
    console.log('Extracting personal information...');
    
    try {
      const html = await this.fetchWithRetry(this.options.baseUrl);
      const $ = cheerio.load(html);
      
      // Extract name - look in common locations
      const name = this.extractName($);
      
      // Extract title/role
      const title = this.extractTitle($);
      
      // Extract bio/about content
      const bio = this.extractBio($);
      
      // Extract contact information
      const email = this.extractEmail($);
      const phone = this.extractPhone($);
      const location = this.extractLocation($);
      
      // Extract social links
      const socialLinks = this.extractSocialLinks($);
      
      const personalInfo: PersonalInfo = {
        name: name || 'Your Name',
        title: title || 'Your Professional Title',
        bio: bio || 'Your professional bio will be migrated here.',
        email: email || 'your.email@example.com',
        phone,
        location,
        socialLinks
      };
      
      console.log('Successfully extracted personal information:', personalInfo);
      return personalInfo;
      
    } catch (error) {
      console.error('Failed to extract personal information:', error);
      throw new Error(`Personal info extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract skills and technology information
   */
  async extractSkills(): Promise<Skill[]> {
    console.log('Extracting skills...');
    
    try {
      const html = await this.fetchWithRetry(this.options.baseUrl);
      const $ = cheerio.load(html);
      const skills: Skill[] = [];
      
      // Look for the Skills section by finding the "Skills" heading
      const skillsHeading = $('h2, h3').filter((_, el) => {
        return $(el).text().trim().toLowerCase() === 'skills';
      }).first();
      
      if (skillsHeading.length > 0) {
        console.log('Found Skills section heading');
        
        // Get the container that holds the skills content
        const $skillsContainer = skillsHeading.parent();
        
        // Look for skill categories (Design, Tools & Methods, etc.)
        const categoryHeadings = $skillsContainer.find('h3').filter((_, el) => {
          const text = $(el).text().trim();
          return text === 'Design' || text === 'Tools & Methods' || text.includes('Design') || text.includes('Tools');
        });
        
        categoryHeadings.each((_, categoryEl) => {
          const $categoryHeading = $(categoryEl);
          const categoryName = $categoryHeading.text().trim();
          
          // Find the content after this category heading
          let $nextElement = $categoryHeading.next();
          const categorySkills: string[] = [];
          
          // Collect text content until we hit another heading or end of section
          while ($nextElement.length > 0 && !$nextElement.is('h1, h2, h3, h4, h5, h6')) {
            const text = $nextElement.text().trim();
            if (text && text.length > 2 && text.length < 500) {
              // Split by common delimiters to extract individual skills
              const skillsInText = text.split(/[,•·\n\r]+/)
                .map(s => s.trim())
                .filter(s => s.length > 1 && s.length < 50)
                .filter(s => !s.match(/^\d+$/) && !s.includes('http')); // Filter out numbers and URLs
              categorySkills.push(...skillsInText);
            }
            $nextElement = $nextElement.next();
          }
          
          // Add skills from this category
          categorySkills.forEach(skillName => {
            if (skillName && !skills.some(s => s.name === skillName)) {
              const category = this.categorizeSkillBySection(categoryName, skillName);
              skills.push({
                name: skillName,
                category,
                proficiency: 80 // Default proficiency for listed skills
              });
            }
          });
        });
      }
      
      // If no skills found through headings, try alternative extraction
      if (skills.length === 0) {
        console.log('No skills found through headings, trying alternative extraction');
        
        // Look for common skill-related text patterns
        const bodyText = $('body').text();
        const skillPatterns = [
          /(?:Skills?|Technologies?|Tools?)[:\s]+([\w\s,•·\n\r-]+?)(?:\n\n|\r\r|$)/gi,
          /(?:Design|Frontend|Backend|Tools?)[:\s]+([\w\s,•·\n\r-]+?)(?:\n\n|\r\r|$)/gi
        ];
        
        skillPatterns.forEach(pattern => {
          const matches = bodyText.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const skillsText = match.replace(/^[^:]+:/, '').trim();
              const skillsArray = skillsText.split(/[,•·\n\r]+/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
              
              skillsArray.forEach(skillName => {
                if (!skills.some(s => s.name === skillName)) {
                  skills.push({
                    name: skillName,
                    category: this.categorizeSkill(skillName),
                    proficiency: 75
                  });
                }
              });
            });
          }
        });
      }
      
      // Fallback: extract from project technologies
      if (skills.length === 0) {
        console.log('No dedicated skills section found, extracting from project technologies');
        const projects = await this.extractProjects();
        const techSet = new Set<string>();
        
        projects.forEach(project => {
          project.technologies?.forEach(tech => techSet.add(tech));
        });
        
        Array.from(techSet).forEach((tech, index) => {
          skills.push({
            name: tech,
            category: this.categorizeSkill(tech),
            proficiency: 75 // Default proficiency
          });
        });
      }
      
      console.log(`Successfully extracted ${skills.length} skills`);
      return skills;
      
    } catch (error) {
      console.error('Failed to extract skills:', error);
      throw new Error(`Skills extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract all images from the old portfolio
   */
  async extractImages(): Promise<ExtractedImage[]> {
    console.log('Extracting images...');
    
    try {
      const html = await this.fetchWithRetry(this.options.baseUrl);
      const $ = cheerio.load(html);
      const images: ExtractedImage[] = [];
      
      // Extract all images from the page
      $('img').each((index, element) => {
        const $img = $(element);
        const src = $img.attr('src');
        const alt = $img.attr('alt') || '';
        
        if (src) {
          const fullUrl = this.resolveUrl(src);
          const type = this.determineImageType(src, alt, $img);
          const localPath = this.generateLocalPath(src, type, index);
          
          images.push({
            url: fullUrl,
            localPath,
            type,
            projectId: type === 'project' ? this.extractProjectIdFromImage($img) : undefined
          });
        }
      });
      
      // Also look for background images in CSS
      $('[style*="background-image"]').each((index, element) => {
        const style = $(element).attr('style') || '';
        const bgImageMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
        
        if (bgImageMatch && bgImageMatch[1]) {
          const src = bgImageMatch[1];
          const fullUrl = this.resolveUrl(src);
          const type = this.determineImageType(src, '', $(element));
          const localPath = this.generateLocalPath(src, type, images.length + index);
          
          images.push({
            url: fullUrl,
            localPath,
            type,
            projectId: type === 'project' ? this.extractProjectIdFromImage($(element)) : undefined
          });
        }
      });
      
      console.log(`Successfully extracted ${images.length} images`);
      return images;
      
    } catch (error) {
      console.error('Failed to extract images:', error);
      throw new Error(`Image extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch HTML content from a URL with retry logic
   */
  private async fetchWithRetry(url: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        console.log(`Fetching ${url} (attempt ${attempt}/${this.options.retryAttempts})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
        console.warn(`Attempt ${attempt} failed:`, lastError.message);

        if (attempt < this.options.retryAttempts) {
          await this.delay(this.options.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Utility function to add delay between retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Parse HTML content and extract specific elements
   */
  private parseHTML(html: string): Document {
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  /**
   * Extract text content from HTML elements
   */
  private extractTextContent(element: Element | null): string {
    return element?.textContent?.trim() || '';
  }

  /**
   * Extract attribute value from HTML elements
   */
  private extractAttribute(element: Element | null, attribute: string): string {
    return element?.getAttribute(attribute) || '';
  }

  /**
   * Resolve relative URLs to absolute URLs
   */
  private resolveUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    if (url.startsWith('/')) {
      const baseUrl = new URL(this.options.baseUrl);
      return `${baseUrl.protocol}//${baseUrl.host}${url}`;
    }
    
    return new URL(url, this.options.baseUrl).href;
  }

  /**
   * Extract project title from project element
   */
  private extractProjectTitle($project: cheerio.Cheerio<cheerio.Element>): string {
    const titleSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.title', '.name', '[class*="title"]'];
    
    for (const selector of titleSelectors) {
      const title = $project.find(selector).first().text().trim();
      if (title) return title;
    }
    
    // Fallback to alt text of images
    const imgAlt = $project.find('img').first().attr('alt');
    return imgAlt || '';
  }

  /**
   * Extract project description from project element
   */
  private extractProjectDescription($project: cheerio.Cheerio<cheerio.Element>): string {
    const descSelectors = ['p', '.description', '.desc', '.summary', '[class*="desc"]'];
    
    for (const selector of descSelectors) {
      const desc = $project.find(selector).first().text().trim();
      if (desc && desc.length > 10) return desc;
    }
    
    return '';
  }

  /**
   * Extract project image from project element
   */
  private extractProjectImage($project: cheerio.Cheerio<cheerio.Element>): string {
    const img = $project.find('img').first();
    const src = img.attr('src');
    
    if (src) return src;
    
    // Check for background images
    const bgImg = $project.find('[style*="background-image"]').first();
    const style = bgImg.attr('style') || '';
    const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
    
    return bgMatch ? bgMatch[1] : '';
  }

  /**
   * Extract technologies from project element
   */
  private extractTechnologies($project: cheerio.Cheerio<cheerio.Element>): string[] {
    const technologies: string[] = [];
    
    // Look for technology lists or badges
    const techSelectors = ['.tech', '.technology', '.skill', '.badge', '.tag', '[class*="tech"]'];
    
    techSelectors.forEach(selector => {
      $project.find(selector).each((_, el) => {
        const tech = cheerio.load(el)(el).text().trim();
        if (tech && !technologies.includes(tech)) {
          technologies.push(tech);
        }
      });
    });
    
    return technologies;
  }

  /**
   * Extract project URLs (live demo, GitHub, etc.)
   */
  private extractProjectUrl($project: cheerio.Cheerio<cheerio.Element>, type: 'live' | 'github'): string | undefined {
    const links = $project.find('a');
    
    links.each((_, el) => {
      const $link = cheerio.load(el)(el);
      const href = $link.attr('href') || '';
      const text = $link.text().toLowerCase();
      const title = $link.attr('title')?.toLowerCase() || '';
      
      if (type === 'github' && (href.includes('github.com') || text.includes('github') || title.includes('github'))) {
        return href;
      }
      
      if (type === 'live' && (text.includes('demo') || text.includes('live') || text.includes('view') || title.includes('demo'))) {
        return href;
      }
    });
    
    return undefined;
  }

  /**
   * Extract name from the page
   */
  private extractName($: cheerio.CheerioAPI): string {
    // First try to get name from title tag
    const title = $('title').text().trim();
    if (title.includes("'s")) {
      const nameFromTitle = title.split("'s")[0].trim();
      if (nameFromTitle && nameFromTitle !== 'Hello') {
        return nameFromTitle;
      }
    }
    
    // Look for name in common selectors, but skip "Hello" as it's likely a greeting
    const nameSelectors = [
      'h1',
      '.name',
      '.title',
      '[class*="name"]',
      'header h1',
      'header h2',
      '.hero h1',
      '.intro h1'
    ];
    
    for (const selector of nameSelectors) {
      const name = $(selector).first().text().trim();
      if (name && name.length > 2 && name.length < 50 && name !== 'Hello') {
        return name;
      }
    }
    
    // Extract from title tag
    const titleParts = title.split(/[-|]/);
    return titleParts[0]?.trim() || 'Khushi'; // Fallback based on the site
  }

  /**
   * Extract professional title from the page
   */
  private extractTitle($: cheerio.CheerioAPI): string {
    // Look for title in page title tag
    const pageTitle = $('title').text().trim();
    if (pageTitle.includes('UI/UX')) {
      return 'UI/UX Designer';
    }
    
    // Look for bio text that contains role information
    const bioText = this.extractBio($);
    if (bioText.includes('UX/UI Designer')) {
      return 'UX/UI Designer';
    } else if (bioText.includes('Designer')) {
      return 'Designer';
    }
    
    const titleSelectors = [
      '.subtitle',
      '.role',
      '.position',
      '.job-title',
      '[class*="subtitle"]',
      'h2',
      '.hero h2',
      '.intro h2'
    ];
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title && title.length > 5 && title.length < 100 && title !== 'Education') {
        return title;
      }
    }
    
    return 'UI/UX Designer'; // Default based on the portfolio content
  }

  /**
   * Extract bio/about content from the page
   */
  private extractBio($: cheerio.CheerioAPI): string {
    const bioSelectors = [
      '.bio',
      '.about',
      '.description',
      '.intro p',
      '.hero p',
      '[class*="bio"]',
      '[class*="about"]'
    ];
    
    for (const selector of bioSelectors) {
      const bio = $(selector).first().text().trim();
      if (bio && bio.length > 50) {
        return bio;
      }
    }
    
    // Fallback to first long paragraph
    const paragraphs = $('p');
    for (let i = 0; i < paragraphs.length; i++) {
      const text = $(paragraphs[i]).text().trim();
      if (text.length > 100) {
        return text;
      }
    }
    
    return '';
  }

  /**
   * Extract email from the page
   */
  private extractEmail($: cheerio.CheerioAPI): string | undefined {
    // Look for mailto links
    const mailtoLinks = $('a[href^="mailto:"]');
    if (mailtoLinks.length > 0) {
      const href = mailtoLinks.first().attr('href') || '';
      return href.replace('mailto:', '');
    }
    
    // Look for email patterns in text
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const bodyText = $('body').text();
    const emailMatch = bodyText.match(emailRegex);
    
    return emailMatch ? emailMatch[0] : undefined;
  }

  /**
   * Extract phone number from the page
   */
  private extractPhone($: cheerio.CheerioAPI): string | undefined {
    // Look for tel links
    const telLinks = $('a[href^="tel:"]');
    if (telLinks.length > 0) {
      const href = telLinks.first().attr('href') || '';
      return href.replace('tel:', '');
    }
    
    // Look for phone patterns in text
    const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const bodyText = $('body').text();
    const phoneMatch = bodyText.match(phoneRegex);
    
    return phoneMatch ? phoneMatch[0] : undefined;
  }

  /**
   * Extract location from the page
   */
  private extractLocation($: cheerio.CheerioAPI): string | undefined {
    const locationSelectors = [
      '.location',
      '.address',
      '[class*="location"]',
      '[class*="address"]'
    ];
    
    for (const selector of locationSelectors) {
      const location = $(selector).first().text().trim();
      if (location && location.length > 3 && location.length < 100) {
        return location;
      }
    }
    
    return undefined;
  }

  /**
   * Extract social media links from the page
   */
  private extractSocialLinks($: cheerio.CheerioAPI): PersonalInfo['socialLinks'] {
    const socialLinks: PersonalInfo['socialLinks'] = {};
    
    $('a').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href') || '';
      const text = $link.text().toLowerCase();
      const title = $link.attr('title')?.toLowerCase() || '';
      
      if (href.includes('linkedin.com') || text.includes('linkedin') || title.includes('linkedin')) {
        socialLinks.linkedin = href;
      } else if (href.includes('twitter.com') || href.includes('x.com') || text.includes('twitter') || title.includes('twitter')) {
        socialLinks.twitter = href;
      } else if (href.includes('github.com') || text.includes('github') || title.includes('github')) {
        socialLinks.github = href;
      } else if (href.includes('instagram.com') || text.includes('instagram') || title.includes('instagram')) {
        socialLinks.instagram = href;
      }
    });
    
    return socialLinks;
  }

  /**
   * Categorize a skill based on its name
   */
  private categorizeSkill(skillName: string): Skill['category'] {
    const skill = skillName.toLowerCase();
    
    const frontendSkills = ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap', 'jquery', 'next.js', 'nuxt', 'svelte'];
    const backendSkills = ['node.js', 'express', 'django', 'flask', 'rails', 'laravel', 'php', 'python', 'java', 'c#', 'go', 'rust', 'mongodb', 'mysql', 'postgresql', 'redis'];
    const designSkills = ['figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'xd', 'ui', 'ux', 'design', 'wireframe', 'prototype'];
    const toolSkills = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'webpack', 'vite', 'npm', 'yarn'];
    
    if (frontendSkills.some(s => skill.includes(s))) return 'frontend';
    if (backendSkills.some(s => skill.includes(s))) return 'backend';
    if (designSkills.some(s => skill.includes(s))) return 'design';
    if (toolSkills.some(s => skill.includes(s))) return 'tools';
    
    return 'design'; // Default category for UI/UX portfolio
  }

  /**
   * Categorize a skill based on the section it was found in
   */
  private categorizeSkillBySection(sectionName: string, skillName: string): Skill['category'] {
    const section = sectionName.toLowerCase();
    
    if (section.includes('design')) {
      return 'design';
    } else if (section.includes('tools') || section.includes('methods')) {
      return 'tools';
    } else if (section.includes('frontend') || section.includes('front-end')) {
      return 'frontend';
    } else if (section.includes('backend') || section.includes('back-end')) {
      return 'backend';
    }
    
    // Fallback to skill name-based categorization
    return this.categorizeSkill(skillName);
  }

  /**
   * Extract proficiency level from skill element
   */
  private extractProficiency($skill: cheerio.Cheerio<cheerio.Element>): number | undefined {
    // Look for progress bars or percentage indicators
    const progressBar = $skill.find('.progress, [class*="progress"]').first();
    if (progressBar.length > 0) {
      const style = progressBar.attr('style') || '';
      const widthMatch = style.match(/width:\s*(\d+)%/);
      if (widthMatch) {
        return parseInt(widthMatch[1]);
      }
    }
    
    // Look for data attributes
    const dataLevel = $skill.attr('data-level') || $skill.attr('data-proficiency');
    if (dataLevel) {
      const level = parseInt(dataLevel);
      return isNaN(level) ? undefined : level;
    }
    
    return undefined;
  }

  /**
   * Determine the type of image based on its source and context
   */
  private determineImageType(src: string, alt: string, $element: cheerio.Cheerio<cheerio.Element>): ExtractedImage['type'] {
    const srcLower = src.toLowerCase();
    const altLower = alt.toLowerCase();
    
    if (srcLower.includes('project') || altLower.includes('project')) {
      return 'project';
    }
    
    if (srcLower.includes('profile') || srcLower.includes('avatar') || altLower.includes('profile') || altLower.includes('avatar')) {
      return 'profile';
    }
    
    if (srcLower.includes('hero') || srcLower.includes('banner') || altLower.includes('hero') || altLower.includes('banner')) {
      return 'hero';
    }
    
    // Check if image is in a project context
    const projectParent = $element.closest('.project, .portfolio-item, .work-item, [class*="project"]');
    if (projectParent.length > 0) {
      return 'project';
    }
    
    return 'gallery';
  }

  /**
   * Generate local path for downloaded image
   */
  private generateLocalPath(src: string, type: ExtractedImage['type'], index: number): string {
    const extension = src.split('.').pop()?.split('?')[0] || 'jpg';
    const filename = `image-${index + 1}.${extension}`;
    
    switch (type) {
      case 'project':
        return `/projects/${filename}`;
      case 'profile':
        return `/images/profile/${filename}`;
      case 'hero':
        return `/images/hero/${filename}`;
      default:
        return `/images/gallery/${filename}`;
    }
  }

  /**
   * Extract project ID from image context
   */
  private extractProjectIdFromImage($element: cheerio.Cheerio<cheerio.Element>): number | undefined {
    const projectParent = $element.closest('.project, .portfolio-item, .work-item, [class*="project"]');
    if (projectParent.length > 0) {
      const dataId = projectParent.attr('data-id') || projectParent.attr('id');
      if (dataId) {
        const id = parseInt(dataId.replace(/\D/g, ''));
        return isNaN(id) ? undefined : id;
      }
    }
    
    return undefined;
  }

  /**
   * Extract technologies from project context based on title and content
   */
  private extractTechnologiesFromContext($container: cheerio.Cheerio<cheerio.Element>, title: string): string[] {
    const technologies: string[] = [];
    
    // Based on the project titles, infer likely technologies
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('hypd')) {
      technologies.push('UI/UX Design', 'Mobile App Design', 'Figma', 'Prototyping');
    } else if (titleLower.includes('greencloz')) {
      technologies.push('UI/UX Design', 'Web Design', 'Figma', 'User Research');
    } else if (titleLower.includes('aero')) {
      technologies.push('UI/UX Design', 'VR Design', 'AI Integration', 'Figma');
    }
    
    // Also look for any explicit technology mentions in the container
    const containerText = $container.text().toLowerCase();
    const commonTechs = ['react', 'vue', 'angular', 'figma', 'sketch', 'adobe', 'ui', 'ux', 'design', 'prototype'];
    
    commonTechs.forEach(tech => {
      if (containerText.includes(tech) && !technologies.some(t => t.toLowerCase().includes(tech))) {
        technologies.push(tech.charAt(0).toUpperCase() + tech.slice(1));
      }
    });
    
    return technologies;
  }

  /**
   * Categorize project based on title and description
   */
  private categorizeProject(title: string, description: string): string {
    const combined = (title + ' ' + description).toLowerCase();
    
    if (combined.includes('mobile') || combined.includes('app')) {
      return 'mobile';
    } else if (combined.includes('web') || combined.includes('website')) {
      return 'web';
    } else if (combined.includes('ui') || combined.includes('ux') || combined.includes('design')) {
      return 'design';
    } else if (combined.includes('vr') || combined.includes('ar')) {
      return 'vr/ar';
    }
    
    return 'design'; // Default for UI/UX portfolio
  }
}