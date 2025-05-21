
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
  // In a real implementation, we would search for image URLs or img tags in the content
  
  // Check if content contains any Facebook or RSS image patterns
  const fbImageRegex = /https:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif)/gi;
  const imgTagRegex = /<img[^>]+src="([^">]+)"/gi;
  
  // Look for Facebook image URLs
  const fbMatches = content.match(fbImageRegex);
  if (fbMatches && fbMatches.length > 0) {
    return fbMatches[0]; // Return the first image URL found
  }
  
  // Look for image tags
  let imgMatch;
  while ((imgMatch = imgTagRegex.exec(content)) !== null) {
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1]; // Return the src attribute of the first img tag
    }
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

// New function to ensure all articles have images
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
