
import { Article } from "../context/ArticleContext";

// This simulates an AI reformatting service
// In a production environment, you would connect to an actual AI API
export const reformatArticleWithAI = async (originalContent: string, originalTitle: string): Promise<{reformattedContent: string, reformattedTitle: string}> => {
  console.log("Reformatting content with AI:", originalTitle);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple simulation of AI reformatting
  // In production, replace with actual API call to a free AI service
  const reformattedTitle = `${originalTitle} | المصدر بلس`;
  const reformattedContent = `${originalContent}\n\nتم إعادة صياغة هذا المحتوى بواسطة الذكاء الاصطناعي للمصدر بلس، وهو خدمة إخبارية تقدم أحدث الأخبار من مصادر موثوقة بأسلوب احترافي ورسمي.`;
  
  return {
    reformattedContent,
    reformattedTitle
  };
};

// Extract image URL from source content - improved version
export const extractImageFromContent = (content: string, fallbackImage: string): string => {
  // First, look for Open Graph image meta tags (common in Facebook and RSS content)
  const ogImageRegex = /<meta\s+(?:[^>]*?\s+)?property=["']og:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const ogMatch = content.match(ogImageRegex);
  if (ogMatch && ogMatch[1]) {
    return ogMatch[1];
  }
  
  // Next, check for images in content with higher resolution
  const imgSrcRegex = /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;
  const imgMatches = [];
  let match;
  
  while ((match = imgSrcRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('emoji') && !match[1].includes('icon') && !match[1].includes('button')) {
      imgMatches.push(match[1]);
    }
  }
  
  // Prioritize larger images (often contain words like large, full, etc.)
  const priorityImage = imgMatches.find(img => 
    img.includes('large') || 
    img.includes('full') || 
    img.includes('cover') || 
    img.includes('og') ||
    img.includes('1200') ||
    img.includes('1024')
  );
  
  if (priorityImage) return priorityImage;
  if (imgMatches.length > 0) return imgMatches[0];
  
  // Check for Facebook or other direct image URLs
  const fbImageRegex = /https:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif)(\?[^"\s]+)?/gi;
  const fbMatches = content.match(fbImageRegex);
  if (fbMatches && fbMatches.length > 0) {
    // Filter out small icons or emojis by looking for keywords
    const filteredImages = fbMatches.filter(img => 
      !img.includes('emoji') && 
      !img.includes('icon') && 
      !img.includes('small')
    );
    
    if (filteredImages.length > 0) {
      return filteredImages[0]; 
    }
    return fbMatches[0];
  }
  
  // If no image found, use a better set of placeholder images
  const dummyImages = [
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=800&auto=format&fit=crop&q=60"
  ];
  
  // Return a random image from our better dummy set
  const randomImage = dummyImages[Math.floor(Math.random() * dummyImages.length)];
  return randomImage || fallbackImage;
};

// Function to update article content with today's date
export const updateArticleDate = (article: Article): Article => {
  const today = new Date().toISOString().split('T')[0];
  return {
    ...article,
    date: today
  };
};

// Ensure all articles have images
export const ensureArticleHasImage = (article: Article): Article => {
  if (!article.image || article.image.includes("placehold.co")) {
    // Extract image from content or use a better placeholder
    const extractedImage = extractImageFromContent(article.content, "");
    return {
      ...article,
      image: extractedImage
    };
  }
  return article;
};

// Process Facebook post to extract image, title, and content
export const processFacebookPost = (post: any): Partial<Article> => {
  // Extract the most useful parts from a Facebook post
  const content = post.message || '';
  
  // Try to get title from the first line or first sentence
  let title = '';
  if (content) {
    // First try to get the first line
    const firstLine = content.split('\n')[0];
    if (firstLine && firstLine.length > 10 && firstLine.length < 100) {
      title = firstLine;
    } else {
      // If first line is not suitable, try to get first sentence
      const firstSentence = content.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 10 && firstSentence.length < 100) {
        title = firstSentence;
      } else {
        // If no good title found, use truncated content
        title = content.length > 80 ? content.substring(0, 80) + '...' : content;
      }
    }
  }
  
  // Extract image from various Facebook post properties
  let image = '';
  
  // Check full_picture first as it's often the main image
  if (post.full_picture) {
    image = post.full_picture;
  } 
  // Then check attachments
  else if (post.attachments && post.attachments.data && post.attachments.data.length) {
    const attachment = post.attachments.data[0];
    if (attachment.media && attachment.media.image) {
      image = attachment.media.image.src;
    } else if (attachment.type === 'share' && attachment.media) {
      image = attachment.media.image?.src || '';
    }
  }
  
  return {
    title,
    content: content || '',
    excerpt: content ? (content.length > 150 ? content.substring(0, 150) + '...' : content) : '',
    image,
    date: post.created_time ? new Date(post.created_time).toISOString() : new Date().toISOString(),
    source: post.from?.name || 'Facebook',
  };
};
