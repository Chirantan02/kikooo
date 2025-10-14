import { Project } from '@/data/projects';
import { PersonalInfo } from '@/data/personal';
import { Skill } from '@/data/skills';
import { ValidationError } from './migration-errors';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  /**
   * Validate project data
   */
  static validateProject(project: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!project.id || typeof project.id !== 'number') {
      errors.push('Project ID is required and must be a number');
    }

    if (!project.title || typeof project.title !== 'string' || project.title.trim().length === 0) {
      errors.push('Project title is required and must be a non-empty string');
    }

    if (!project.description || typeof project.description !== 'string' || project.description.trim().length === 0) {
      errors.push('Project description is required and must be a non-empty string');
    }

    if (!project.image || typeof project.image !== 'string' || project.image.trim().length === 0) {
      errors.push('Project image is required and must be a non-empty string');
    }

    // Optional fields validation
    if (project.technologies && !Array.isArray(project.technologies)) {
      errors.push('Project technologies must be an array');
    }

    if (project.liveUrl && (typeof project.liveUrl !== 'string' || !this.isValidUrl(project.liveUrl))) {
      warnings.push('Project live URL should be a valid URL');
    }

    if (project.githubUrl && (typeof project.githubUrl !== 'string' || !this.isValidUrl(project.githubUrl))) {
      warnings.push('Project GitHub URL should be a valid URL');
    }

    if (project.category && typeof project.category !== 'string') {
      warnings.push('Project category should be a string');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate personal information data
   */
  static validatePersonalInfo(personalInfo: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!personalInfo.name || typeof personalInfo.name !== 'string' || personalInfo.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }

    if (!personalInfo.title || typeof personalInfo.title !== 'string' || personalInfo.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string');
    }

    if (!personalInfo.bio || typeof personalInfo.bio !== 'string' || personalInfo.bio.trim().length === 0) {
      errors.push('Bio is required and must be a non-empty string');
    }

    if (!personalInfo.email || typeof personalInfo.email !== 'string' || !this.isValidEmail(personalInfo.email)) {
      errors.push('Valid email is required');
    }

    // Optional fields validation
    if (personalInfo.phone && typeof personalInfo.phone !== 'string') {
      warnings.push('Phone should be a string');
    }

    if (personalInfo.location && typeof personalInfo.location !== 'string') {
      warnings.push('Location should be a string');
    }

    // Social links validation
    if (personalInfo.socialLinks) {
      if (typeof personalInfo.socialLinks !== 'object') {
        errors.push('Social links must be an object');
      } else {
        const socialPlatforms = ['linkedin', 'twitter', 'github', 'instagram'];
        for (const platform of socialPlatforms) {
          const url = personalInfo.socialLinks[platform];
          if (url && (typeof url !== 'string' || !this.isValidUrl(url))) {
            warnings.push(`${platform} URL should be a valid URL`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate skill data
   */
  static validateSkill(skill: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!skill.name || typeof skill.name !== 'string' || skill.name.trim().length === 0) {
      errors.push('Skill name is required and must be a non-empty string');
    }

    const validCategories = ['frontend', 'backend', 'design', 'tools'];
    if (!skill.category || !validCategories.includes(skill.category)) {
      errors.push(`Skill category must be one of: ${validCategories.join(', ')}`);
    }

    // Optional fields validation
    if (skill.proficiency !== undefined) {
      if (typeof skill.proficiency !== 'number' || skill.proficiency < 0 || skill.proficiency > 100) {
        warnings.push('Skill proficiency should be a number between 0 and 100');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate array of projects
   */
  static validateProjects(projects: any[]): ValidationResult {
    if (!Array.isArray(projects)) {
      return {
        isValid: false,
        errors: ['Projects must be an array'],
        warnings: []
      };
    }

    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const usedIds = new Set<number>();

    projects.forEach((project, index) => {
      const result = this.validateProject(project);
      
      // Add index to error messages for clarity
      result.errors.forEach(error => {
        allErrors.push(`Project ${index + 1}: ${error}`);
      });
      
      result.warnings.forEach(warning => {
        allWarnings.push(`Project ${index + 1}: ${warning}`);
      });

      // Check for duplicate IDs
      if (project.id && usedIds.has(project.id)) {
        allErrors.push(`Project ${index + 1}: Duplicate project ID ${project.id}`);
      } else if (project.id) {
        usedIds.add(project.id);
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  /**
   * Validate array of skills
   */
  static validateSkills(skills: any[]): ValidationResult {
    if (!Array.isArray(skills)) {
      return {
        isValid: false,
        errors: ['Skills must be an array'],
        warnings: []
      };
    }

    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    skills.forEach((skill, index) => {
      const result = this.validateSkill(skill);
      
      result.errors.forEach(error => {
        allErrors.push(`Skill ${index + 1}: ${error}`);
      });
      
      result.warnings.forEach(warning => {
        allWarnings.push(`Skill ${index + 1}: ${warning}`);
      });
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  /**
   * Validate URL format
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Throw validation error if data is invalid
   */
  static assertValid(result: ValidationResult, context: string): void {
    if (!result.isValid) {
      throw new ValidationError(
        `Validation failed for ${context}: ${result.errors.join(', ')}`,
        context,
        { errors: result.errors, warnings: result.warnings }
      );
    }
  }
}