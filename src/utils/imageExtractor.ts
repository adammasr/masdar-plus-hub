
// Enhanced image extraction with better variety
export const extractImageFromContent = (content: string, fallbackImage: string = ""): string => {
  // Try to extract original images from RSS content first
  const originalImage = extractOriginalRSSImage(content);
  if (originalImage) {
    console.log("Found original RSS image:", originalImage);
    return originalImage;
  }

  // Try Open Graph images
  const ogImageRegex = /<meta\s+(?:[^>]*?\s+)?property=["']og:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const ogMatch = content.match(ogImageRegex);
  if (ogMatch && ogMatch[1]) {
    return ogMatch[1];
  }
  
  // Try Twitter card images
  const twitterCardRegex = /<meta\s+(?:[^>]*?\s+)?name=["']twitter:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const twitterMatch = content.match(twitterCardRegex);
  if (twitterMatch && twitterMatch[1]) {
    return twitterMatch[1];
  }
  
  // Extract images from img tags with scoring
  const imgSrcRegex = /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;
  const imgMatches = [];
  let match;
  
  while ((match = imgSrcRegex.exec(content)) !== null) {
    if (match[1] && 
        !match[1].includes('emoji') && 
        !match[1].includes('icon') && 
        !match[1].includes('button') && 
        !match[1].includes('logo') &&
        match[1].match(/\.(jpe?g|png|gif|webp)/i)) {
      imgMatches.push(match[1]);
    }
  }
  
  if (imgMatches.length > 0) {
    // Score and return best image
    const scoredImages = imgMatches.map(img => ({
      url: img,
      score: scoreImage(img)
    }));
    
    scoredImages.sort((a, b) => b.score - a.score);
    return scoredImages[0].url;
  }
  
  // Use contextual image based on content
  return getContextualImage(content);
};

// Extract original RSS image from content
const extractOriginalRSSImage = (content: string): string | null => {
  // Look for enclosure tags (common in RSS feeds)
  const enclosureRegex = /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\/[^"']+["'][^>]*>/i;
  const enclosureMatch = content.match(enclosureRegex);
  if (enclosureMatch && enclosureMatch[1]) {
    return enclosureMatch[1];
  }

  // Look for media:content tags
  const mediaContentRegex = /<media:content[^>]+url=["']([^"']+)["'][^>]*type=["']image\/[^"']+["'][^>]*>/i;
  const mediaMatch = content.match(mediaContentRegex);
  if (mediaMatch && mediaMatch[1]) {
    return mediaMatch[1];
  }

  // Look for RSS media:thumbnail
  const mediaThumbnailRegex = /<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/i;
  const thumbnailMatch = content.match(mediaThumbnailRegex);
  if (thumbnailMatch && thumbnailMatch[1]) {
    return thumbnailMatch[1];
  }

  // Look for standard img tags with high quality indicators
  const highQualityImgRegex = /<img[^>]+src=["']([^"']+\.(jpg|jpeg|png|webp))["'][^>]*(?:width=["']\d{3,}["']|height=["']\d{3,}["'])[^>]*>/i;
  const highQualityMatch = content.match(highQualityImgRegex);
  if (highQualityMatch && highQualityMatch[1]) {
    return highQualityMatch[1];
  }

  return null;
};

// Get contextual image from Unsplash based on content - NOW EXPORTED
export const getContextualImage = (content: string): string => {
  const contentLower = content.toLowerCase();
  
  // Enhanced Arabic content detection
  const imageQueries = [];
  
  // Arabic keywords mapping to appropriate searches
  if (contentLower.includes('ذكاء اصطناعي') || contentLower.includes('ai') || contentLower.includes('تكنولوجيا')) {
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('سياسة') || contentLower.includes('حكومة') || contentLower.includes('رئيس') || contentLower.includes('وزير')) {
    return 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('اقتصاد') || contentLower.includes('مال') || contentLower.includes('استثمار') || contentLower.includes('بنك')) {
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('عسكري') || contentLower.includes('دفاع') || contentLower.includes('جيش')) {
    return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('محافظ') || contentLower.includes('مدينة') || contentLower.includes('محلي')) {
    return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('دولي') || contentLower.includes('عالم') || contentLower.includes('خارجي')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('رياضة') || contentLower.includes('كرة') || contentLower.includes('مباراة')) {
    return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60';
  } else if (contentLower.includes('صحة') || contentLower.includes('طب') || contentLower.includes('مستشفى')) {
    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop&q=60';
  }
  
  // Default news image for general content
  return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60';
};

// Score images based on quality indicators
const scoreImage = (imageUrl: string): number => {
  let score = 0;
  
  // Prefer larger images
  if (imageUrl.includes('large') || imageUrl.includes('full')) score += 5;
  if (imageUrl.includes('1200') || imageUrl.includes('2048')) score += 3;
  if (imageUrl.includes('thumb') || imageUrl.includes('small')) score -= 3;
  
  // Prefer certain domains
  if (imageUrl.includes('unsplash.com')) score += 2;
  if (imageUrl.includes('reuters.com')) score += 2;
  if (imageUrl.includes('aljazeera.net')) score += 2;
  if (imageUrl.includes('bbc.com')) score += 2;
  
  // Check for resolution patterns
  const resMatch = imageUrl.match(/(\d+)x(\d+)/);
  if (resMatch) {
    const width = parseInt(resMatch[1]);
    if (width >= 1200) score += 4;
    else if (width >= 800) score += 2;
    else if (width <= 300) score -= 2;
  }
  
  return score;
};
