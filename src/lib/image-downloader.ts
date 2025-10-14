import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

export interface ImageDownloadConfig {
  url: string;
  filename: string;
  directory: string;
}

export interface DownloadResult {
  success: boolean;
  filepath?: string;
  error?: string;
}

/**
 * Creates directory structure if it doesn't exist
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Downloads an image from a URL and saves it to the specified path
 */
export async function downloadImage(config: ImageDownloadConfig): Promise<DownloadResult> {
  const { url, filename, directory } = config;
  
  try {
    // Ensure directory exists
    ensureDirectoryExists(directory);
    
    const filepath = path.join(directory, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Image already exists: ${filepath}`);
      return { success: true, filepath };
    }
    
    return new Promise((resolve) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      const request = protocol.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadImage({ ...config, url: redirectUrl }).then(resolve);
            return;
          }
        }
        
        if (response.statusCode !== 200) {
          resolve({
            success: false,
            error: `HTTP ${response.statusCode}: ${response.statusMessage}`
          });
          return;
        }
        
        const fileStream = fs.createWriteStream(filepath);
        
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve({ success: true, filepath });
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete partial file
          resolve({
            success: false,
            error: `File write error: ${err.message}`
          });
        });
      });
      
      request.on('error', (err) => {
        resolve({
          success: false,
          error: `Request error: ${err.message}`
        });
      });
      
      // Set timeout
      request.setTimeout(30000, () => {
        request.destroy();
        resolve({
          success: false,
          error: 'Request timeout'
        });
      });
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Downloads multiple images with retry logic
 */
export async function downloadImages(
  configs: ImageDownloadConfig[],
  maxRetries: number = 3
): Promise<DownloadResult[]> {
  const results: DownloadResult[] = [];
  
  for (const config of configs) {
    let result: DownloadResult;
    let attempts = 0;
    
    do {
      attempts++;
      result = await downloadImage(config);
      
      if (!result.success && attempts < maxRetries) {
        console.log(`Retry ${attempts}/${maxRetries} for ${config.url}`);
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    } while (!result.success && attempts < maxRetries);
    
    results.push(result);
  }
  
  return results;
}