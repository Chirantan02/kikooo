import { ContentExtractor, ScrapingOptions } from './content-extractor';
import { MigrationLogger, LogLevel } from './migration-logger';
import { ErrorHandler, MigrationError } from './migration-errors';
import { DataValidator } from './data-validator';

export interface MigrationConfig {
  sourceUrl: string;
  outputDir?: string;
  logLevel?: LogLevel;
  validateData?: boolean;
  scrapingOptions?: Partial<ScrapingOptions>;
}

export class MigrationUtils {
  private logger: MigrationLogger;
  private extractor: ContentExtractor;
  private config: Required<MigrationConfig>;

  constructor(config: MigrationConfig) {
    this.config = {
      sourceUrl: config.sourceUrl,
      outputDir: config.outputDir || './migrated-content',
      logLevel: config.logLevel || LogLevel.INFO,
      validateData: config.validateData !== false,
      scrapingOptions: config.scrapingOptions || {}
    };

    this.logger = new MigrationLogger(this.config.logLevel);
    
    const scrapingOptions: ScrapingOptions = {
      baseUrl: this.config.sourceUrl,
      ...this.config.scrapingOptions
    };
    
    this.extractor = new ContentExtractor(scrapingOptions);
  }

  /**
   * Run the complete migration process
   */
  async runMigration(): Promise<void> {
    try {
      this.logger.info('Starting portfolio content migration', {
        sourceUrl: this.config.sourceUrl,
        outputDir: this.config.outputDir
      });

      // Extract content
      const extractedContent = await this.extractor.extractAllContent();
      this.logger.info('Content extraction completed', {
        projectsCount: extractedContent.projects.length,
        skillsCount: extractedContent.skills.length,
        imagesCount: extractedContent.images.length
      });

      // Validate data if enabled
      if (this.config.validateData) {
        await this.validateExtractedData(extractedContent);
      }

      this.logger.info('Migration completed successfully');

    } catch (error) {
      const migrationError = ErrorHandler.handleError(error, 'migration');
      this.logger.error('Migration failed', migrationError);
      throw migrationError;
    }
  }

  /**
   * Validate all extracted data
   */
  private async validateExtractedData(content: any): Promise<void> {
    this.logger.info('Validating extracted data...');

    try {
      // Validate projects
      const projectsResult = DataValidator.validateProjects(content.projects);
      if (!projectsResult.isValid) {
        this.logger.error('Project validation failed', undefined, {
          errors: projectsResult.errors
        });
      }
      if (projectsResult.warnings.length > 0) {
        this.logger.warn('Project validation warnings', {
          warnings: projectsResult.warnings
        });
      }

      // Validate personal info
      const personalResult = DataValidator.validatePersonalInfo(content.personalInfo);
      if (!personalResult.isValid) {
        this.logger.error('Personal info validation failed', undefined, {
          errors: personalResult.errors
        });
      }
      if (personalResult.warnings.length > 0) {
        this.logger.warn('Personal info validation warnings', {
          warnings: personalResult.warnings
        });
      }

      // Validate skills
      const skillsResult = DataValidator.validateSkills(content.skills);
      if (!skillsResult.isValid) {
        this.logger.error('Skills validation failed', undefined, {
          errors: skillsResult.errors
        });
      }
      if (skillsResult.warnings.length > 0) {
        this.logger.warn('Skills validation warnings', {
          warnings: skillsResult.warnings
        });
      }

      // Assert all validations passed
      DataValidator.assertValid(projectsResult, 'projects');
      DataValidator.assertValid(personalResult, 'personal info');
      DataValidator.assertValid(skillsResult, 'skills');

      this.logger.info('Data validation completed successfully');

    } catch (error) {
      const validationError = ErrorHandler.handleError(error, 'validation');
      this.logger.error('Data validation failed', validationError);
      throw validationError;
    }
  }

  /**
   * Get migration logs
   */
  getLogs(): string {
    return this.logger.exportLogs();
  }

  /**
   * Clear migration logs
   */
  clearLogs(): void {
    this.logger.clearLogs();
  }

  /**
   * Create a migration instance with default settings
   */
  static createDefault(sourceUrl: string): MigrationUtils {
    return new MigrationUtils({
      sourceUrl,
      logLevel: LogLevel.INFO,
      validateData: true
    });
  }
}