
import { Article } from "../context/ArticleContext";
import { generateContentTags } from "./contentTagging";
import { estimateReadingTime } from "./textUtils";
import { getContextualImage } from "./imageExtractor";

// Enhanced Facebook post processing
export const processFacebookPost = (post: any): Partial<Article> => {
  const content = post.message || '';
  
  let title = '';
  if (content) {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const potentialTitle = lines.find(line => line.length > 10 && line.length < 100);
    
    if (potentialTitle) {
      title = potentialTitle;
    } else {
      const firstSentence = content.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 10 && firstSentence.length < 100) {
        title = firstSentence;
      } else {
        title = content.length > 80 ? content.substring(0, 80) + '...' : content;
      }
    }
    title = title.replace(/https?:\/\/\S+/g, '').trim();
  }
  
  // Enhanced image extraction from Facebook
  let image = '';
  if (post.attachments?.data && post.attachments.data.length) {
    for (const attachment of post.attachments.data) {
      if (attachment.media?.image?.src) {
        image = attachment.media.image.src;
        break;
      }
      
      if (attachment.subattachments?.data) {
        const subImageSrc = attachment.subattachments.data[0]?.media?.image?.src;
        if (subImageSrc) {
          image = subImageSrc;
          break;
        }
      }
    }
  }
  
  if (!image && post.full_picture) {
    image = post.full_picture;
  }
  
  // If no image found, use contextual image
  if (!image) {
    image = getContextualImage(content);
  }
  
  const excerpt = content 
    ? content.substring(0, 200).replace(/https?:\/\/\S+/g, '').trim() + (content.length > 200 ? '...' : '') 
    : '';
  
  const generatedTags = generateContentTags(content, title);
  
  return {
    title,
    content: content || '',
    excerpt,
    image,
    date: post.created_time ? new Date(post.created_time).toISOString() : new Date().toISOString(),
    source: post.from?.name || 'Facebook',
    tags: generatedTags,
    readingTime: estimateReadingTime(content || ''),
    originalSource: post.from?.name
  };
};

// Helper function to get contextual image (re-exported from imageExtractor)
const getContextualImage = (content: string): string => {
  const contentLower = content.toLowerCase();
  const imageQueries = [];
  
  // Determine content category and generate appropriate search terms
  if (contentLower.includes('ذكاء اصطناعي') || contentLower.includes('ai')) {
    imageQueries.push('artificial-intelligence', 'technology', 'robot', 'computer');
  } else if (contentLower.includes('تكنولوجيا') || contentLower.includes('تقنية')) {
    imageQueries.push('technology', 'computer', 'digital', 'innovation');
  } else if (contentLower.includes('سياسة') || contentLower.includes('حكومة') || contentLower.includes('رئيس')) {
    imageQueries.push('government', 'politics', 'meeting', 'conference');
  } else if (contentLower.includes('اقتصاد') || contentLower.includes('مال') || contentLower.includes('استثمار')) {
    imageQueries.push('business', 'finance', 'money', 'economy');
  } else if (contentLower.includes('رياضة') || contentLower.includes('كرة') || contentLower.includes('مباراة')) {
    imageQueries.push('sports', 'football', 'soccer', 'stadium');
  } else if (contentLower.includes('صحة') || contentLower.includes('طب')) {
    imageQueries.push('health', 'medical', 'hospital', 'doctor');
  } else if (contentLower.includes('عسكري') || contentLower.includes('دفاع')) {
    imageQueries.push('military', 'defense', 'security', 'army');
  } else if (contentLower.includes('علم') || contentLower.includes('بحث')) {
    imageQueries.push('science', 'research', 'laboratory', 'discovery');
  } else if (contentLower.includes('تعليم') || contentLower.includes('جامعة')) {
    imageQueries.push('education', 'university', 'students', 'learning');
  } else if (contentLower.includes('بيئة') || contentLower.includes('مناخ')) {
    imageQueries.push('environment', 'nature', 'climate', 'earth');
  }
  
  // If no specific category, use general news-related terms
  if (imageQueries.length === 0) {
    imageQueries.push('news', 'newspaper', 'journalism', 'media');
  }
  
  // Select a random query and generate Unsplash URL
  const randomQuery = imageQueries[Math.floor(Math.random() * imageQueries.length)];
  const randomId = Math.floor(Math.random() * 1000);
  
  return `https://images.unsplash.com/photo-${1500000000000 + randomId}?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=search-${randomQuery}`;
};
