
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

// Get contextual image from Unsplash based on content - NOW EXPORTED
export const getContextualImage = (content: string): string => {
  const contentLower = content.toLowerCase();
  
  // Enhanced Arabic content detection with better image variety
  if (contentLower.includes('ذكاء اصطناعي') || contentLower.includes('ai') || contentLower.includes('تكنولوجيا') || contentLower.includes('تقني')) {
    const aiImages = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=60'
    ];
    return aiImages[Math.floor(Math.random() * aiImages.length)];
  } 
  
  if (contentLower.includes('سياس') || contentLower.includes('حكوم') || contentLower.includes('رئيس') || contentLower.includes('وزير') || contentLower.includes('برلمان')) {
    const politicsImages = [
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60'
    ];
    return politicsImages[Math.floor(Math.random() * politicsImages.length)];
  } 
  
  if (contentLower.includes('اقتصاد') || contentLower.includes('مال') || contentLower.includes('استثمار') || contentLower.includes('بنك') || contentLower.includes('بورصة')) {
    const economyImages = [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60'
    ];
    return economyImages[Math.floor(Math.random() * economyImages.length)];
  } 
  
  if (contentLower.includes('عسكري') || contentLower.includes('دفاع') || contentLower.includes('جيش') || contentLower.includes('أمن')) {
    const militaryImages = [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800&auto=format&fit=crop&q=60'
    ];
    return militaryImages[Math.floor(Math.random() * militaryImages.length)];
  } 
  
  if (contentLower.includes('محافظ') || contentLower.includes('مدينة') || contentLower.includes('محلي') || 
      contentLower.includes('قاهرة') || contentLower.includes('إسكندرية') || contentLower.includes('جيزة')) {
    const governoratesImages = [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=60'
    ];
    return governoratesImages[Math.floor(Math.random() * governoratesImages.length)];
  } 
  
  if (contentLower.includes('دولي') || contentLower.includes('عالم') || contentLower.includes('خارجي') || 
      contentLower.includes('أمريكا') || contentLower.includes('أوروبا') || contentLower.includes('عربي')) {
    const worldImages = [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1457464901128-858c524a9b7b?w=800&auto=format&fit=crop&q=60'
    ];
    return worldImages[Math.floor(Math.random() * worldImages.length)];
  } 
  
  if (contentLower.includes('رياضة') || contentLower.includes('كرة') || contentLower.includes('مباراة') || 
      contentLower.includes('بطولة') || contentLower.includes('أولمبياد')) {
    const sportsImages = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=60'
    ];
    return sportsImages[Math.floor(Math.random() * sportsImages.length)];
  } 
  
  if (contentLower.includes('صحة') || contentLower.includes('طب') || contentLower.includes('مستشفى') || 
      contentLower.includes('علاج') || contentLower.includes('طبي')) {
    const healthImages = [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=60'
    ];
    return healthImages[Math.floor(Math.random() * healthImages.length)];
  }
  
  // Default news images for general content
  const defaultImages = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&auto=format&fit=crop&q=60'
  ];
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
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
