#!/usr/bin/env tsx

import * as cheerio from 'cheerio';

async function debugScraper() {
  console.log('Debugging scraper by examining HTML structure...');
  
  try {
    const response = await fetch('https://khushi-beige.vercel.app/');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    console.log('\n=== Page Title ===');
    console.log($('title').text());
    
    console.log('\n=== Main Headings ===');
    $('h1, h2, h3').each((_, el) => {
      console.log(`${el.tagName}: ${$(el).text().trim()}`);
    });
    
    console.log('\n=== All Class Names (first 20) ===');
    const classNames = new Set<string>();
    $('[class]').each((_, el) => {
      const classes = $(el).attr('class')?.split(' ') || [];
      classes.forEach(cls => classNames.add(cls));
    });
    Array.from(classNames).slice(0, 20).forEach(cls => console.log(`- ${cls}`));
    
    console.log('\n=== Images with Alt Text ===');
    $('img').each((index, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt');
      console.log(`${index + 1}. ${src} (alt: "${alt}")`);
    });
    
    console.log('\n=== Links ===');
    $('a[href]').each((index, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (text && href) {
        console.log(`${index + 1}. "${text}" -> ${href}`);
      }
    });
    
    console.log('\n=== Potential Project Containers ===');
    const potentialSelectors = ['.project', '.portfolio', '.work', '.card', '.item', '[class*="project"]', '[class*="work"]'];
    potentialSelectors.forEach(selector => {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`${selector}: ${elements.length} elements found`);
      }
    });
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugScraper();