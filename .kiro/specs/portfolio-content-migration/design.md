# Design Document

## Overview

This design outlines the migration of content from the existing portfolio website (https://khushi-beige.vercel.app/) to the new Next.js portfolio template. The migration will involve extracting content, images, and data from the old site and adapting it to work with the new template's structure, which uses Next.js 15, React 19, Framer Motion, and TailwindCSS.

The current template has a sophisticated structure with:
- Project gallery with smooth animations
- About section with personal information
- Contact section with form
- Responsive design with premium typography
- Image-based project showcases

## Architecture

### Content Extraction Strategy
The migration will use a multi-step approach:

1. **Web Scraping**: Extract content from the live old portfolio site
2. **Image Download**: Download and organize all images from the old site
3. **Data Transformation**: Convert extracted data to match the new template's data models
4. **File Integration**: Update template files with migrated content

### Data Flow
```
Old Portfolio (khushi-beige.vercel.app)
    ↓ (Web Scraping)
Raw Extracted Data
    ↓ (Data Processing)
Structured Data Objects
    ↓ (File Updates)
New Template Files
```

## Components and Interfaces

### Data Models

#### Project Interface (Enhanced)
```typescript
interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
}
```

#### Personal Information Interface
```typescript
interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}
```

#### Skills Interface
```typescript
interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'tools';
  proficiency?: number;
}
```

### Migration Components

#### ContentExtractor
- Responsible for scraping content from the old portfolio
- Handles different content types (text, images, links)
- Implements retry logic for failed requests

#### ImageDownloader
- Downloads images from the old site
- Optimizes images for web performance
- Organizes images in the public directory structure

#### DataTransformer
- Converts raw scraped data to structured interfaces
- Handles data validation and cleaning
- Maps old data structure to new template requirements

#### FileUpdater
- Updates template files with migrated content
- Maintains existing code structure and styling
- Preserves animations and interactive features

## Data Models

### File Structure Updates

#### Projects Data (`src/data/projects.ts`)
- Replace placeholder projects with real project data
- Add additional fields for technologies, links, and categories
- Maintain compatibility with existing gallery components

#### Personal Information (`src/data/personal.ts` - New)
- Create new data file for personal information
- Include bio, contact details, and social links
- Support the About and Contact sections

#### Skills Data (`src/data/skills.ts` - New)
- Create structured skills data
- Categorize skills by type
- Support potential skills visualization components

### Image Organization
```
public/
├── images/
│   ├── profile/
│   │   ├── avatar.jpg
│   │   └── hero-bg.jpg
│   ├── projects/
│   │   ├── project-1/
│   │   │   ├── main.jpg
│   │   │   └── thumbnails/
│   │   └── project-2/
│   └── gallery/
└── icons/
```

## Error Handling

### Network Errors
- Implement retry mechanisms for failed downloads
- Provide fallback content for missing resources
- Log errors for manual review

### Data Validation
- Validate extracted data against defined interfaces
- Handle missing or malformed data gracefully
- Provide default values where appropriate

### File System Errors
- Check file permissions before writing
- Handle disk space limitations
- Backup existing files before overwriting

## Testing Strategy

### Unit Tests
- Test data extraction functions
- Validate data transformation logic
- Test file writing operations

### Integration Tests
- Test end-to-end migration process
- Verify image downloads and organization
- Validate final template functionality

### Manual Testing
- Visual comparison between old and new sites
- Test responsive design on different devices
- Verify all links and interactions work correctly

### Performance Testing
- Measure image loading performance
- Test animation smoothness
- Validate Core Web Vitals metrics

## Implementation Phases

### Phase 1: Content Analysis
- Analyze old portfolio structure
- Identify all content types and locations
- Map content to new template sections

### Phase 2: Data Extraction
- Implement web scraping functionality
- Extract text content, images, and metadata
- Store raw data in structured format

### Phase 3: Image Migration
- Download all images from old site
- Optimize images for performance
- Organize in new directory structure

### Phase 4: Data Integration
- Transform extracted data to new formats
- Update template data files
- Integrate with existing components

### Phase 5: Styling and Polish
- Ensure content fits new design system
- Adjust layouts if necessary
- Test responsive behavior

### Phase 6: Validation and Testing
- Compare old vs new portfolio
- Test all functionality
- Performance optimization

## Technical Considerations

### Performance Optimization
- Implement lazy loading for images
- Use Next.js Image component for optimization
- Minimize bundle size impact

### SEO Preservation
- Maintain meta tags and descriptions
- Preserve URL structure where possible
- Implement proper redirects if needed

### Accessibility
- Ensure alt text for all images
- Maintain keyboard navigation
- Preserve screen reader compatibility

### Browser Compatibility
- Test across major browsers
- Ensure animations work consistently
- Provide fallbacks for older browsers