
// Enhanced image extraction with better variety and consistency
export const extractImageFromContent = (content: string, fallbackImage: string = ""): string => {
  // Try to extract original images from RSS content first
  const originalImage = extractOriginalRSSImage(content);
  if (originalImage && isValidImageUrl(originalImage)) {
    console.log("Found original RSS image:", originalImage);
    return originalImage;
  }

  // Try Open Graph images
  const ogImageRegex = /<meta\s+(?:[^>]*?\s+)?property=["']og:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const ogMatch = content.match(ogImageRegex);
  if (ogMatch && ogMatch[1] && isValidImageUrl(ogMatch[1])) {
    return ogMatch[1];
  }
  
  // Try Twitter card images
  const twitterCardRegex = /<meta\s+(?:[^>]*?\s+)?name=["']twitter:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const twitterMatch = content.match(twitterCardRegex);
  if (twitterMatch && twitterMatch[1] && isValidImageUrl(twitterMatch[1])) {
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
        !match[1].includes('avatar') &&
        !match[1].includes('placeholder') &&
        isValidImageUrl(match[1]) &&
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
  
  // Use contextual image based on content as a last resort
  const contextualImage = getContextualImage(content);
  if (contextualImage) {
    return contextualImage;
  }

  // If no image is found by any method, return the fallbackImage (which might be an empty string or null)
  return fallbackImage; 
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

// Validate image URL
const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // Check if URL is valid
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it's an image format
  const imageExtensions = /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i;
  const hasImageExtension = imageExtensions.test(url);
  
  // Check for common image hosting domains
  const imageHosts = ['unsplash.com', 'images.', 'img.', 'static.', 'cdn.', 'media.'];
  const isImageHost = imageHosts.some(host => url.includes(host));
  
  return hasImageExtension || isImageHost;
};

// Get contextual image - NOW RETURNS NULL
export const getContextualImage = (content: string): string | null => {
  // This function previously returned a random Unsplash image.
  // As per requirements, it now returns null.
  // Optionally, it could return a path to a local placeholder image, e.g., "/public/placeholder.svg".
  return null;
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
  if (imageUrl.includes('cnn.com')) score += 2;
  
  // Avoid low quality indicators
  if (imageUrl.includes('placeholder')) score -= 5;
  if (imageUrl.includes('default')) score -= 3;
  if (imageUrl.includes('avatar')) score -= 4;
  
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
