export class MigrationError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);
    this.name = 'MigrationError';
    this.code = code;
    this.context = context;
  }
}

export class NetworkError extends MigrationError {
  constructor(message: string, url?: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', { url, statusCode });
    this.name = 'NetworkError';
  }
}

export class ParseError extends MigrationError {
  constructor(message: string, source?: string) {
    super(message, 'PARSE_ERROR', { source });
    this.name = 'ParseError';
  }
}

export class ValidationError extends MigrationError {
  constructor(message: string, field?: string, value?: any) {
    super(message, 'VALIDATION_ERROR', { field, value });
    this.name = 'ValidationError';
  }
}

export class FileSystemError extends MigrationError {
  constructor(message: string, path?: string, operation?: string) {
    super(message, 'FILESYSTEM_ERROR', { path, operation });
    this.name = 'FileSystemError';
  }
}

export class ImageDownloadError extends MigrationError {
  constructor(message: string, imageUrl?: string, destinationPath?: string) {
    super(message, 'IMAGE_DOWNLOAD_ERROR', { imageUrl, destinationPath });
    this.name = 'ImageDownloadError';
  }
}

/**
 * Error handler utility for migration operations
 */
export class ErrorHandler {
  /**
   * Handle and categorize errors during migration
   */
  static handleError(error: unknown, context?: string): MigrationError {
    if (error instanceof MigrationError) {
      return error;
    }

    if (error instanceof Error) {
      // Categorize common error types
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return new NetworkError(error.message);
      }
      
      if (error.message.includes('parse') || error.message.includes('JSON')) {
        return new ParseError(error.message);
      }
      
      if (error.message.includes('ENOENT') || error.message.includes('file')) {
        return new FileSystemError(error.message);
      }

      // Generic migration error
      return new MigrationError(
        error.message,
        'UNKNOWN_ERROR',
        { originalError: error.name, context }
      );
    }

    // Handle non-Error objects
    return new MigrationError(
      `Unknown error occurred: ${String(error)}`,
      'UNKNOWN_ERROR',
      { context }
    );
  }

  /**
   * Check if an error is recoverable (can be retried)
   */
  static isRecoverable(error: MigrationError): boolean {
    const recoverableCodes = [
      'NETWORK_ERROR',
      'IMAGE_DOWNLOAD_ERROR'
    ];
    
    return recoverableCodes.includes(error.code);
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: MigrationError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Failed to connect to the old portfolio. Please check your internet connection and try again.';
      case 'PARSE_ERROR':
        return 'Failed to parse content from the old portfolio. The website structure may have changed.';
      case 'VALIDATION_ERROR':
        return 'The extracted data is invalid. Please check the source content.';
      case 'FILESYSTEM_ERROR':
        return 'Failed to save files. Please check file permissions and available disk space.';
      case 'IMAGE_DOWNLOAD_ERROR':
        return 'Failed to download images. Some images may be missing or inaccessible.';
      default:
        return 'An unexpected error occurred during migration. Please try again.';
    }
  }
}