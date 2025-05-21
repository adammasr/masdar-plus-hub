
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

// Extract image URL from source content
export const extractImageFromContent = (content: string, fallbackImage: string): string => {
  // This is a simplified version - in production you would implement proper image extraction
  // For Facebook or RSS content, you would parse the HTML and extract image URLs
  
  // Simulate finding an image in the content
  const dummyImages = [
    "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس+1",
    "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس+2",
    "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس+3",
    "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس+4",
  ];
  
  // In a real implementation, you would search for img tags or image URLs in the content
  // For now, return a random image from our dummy set
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
