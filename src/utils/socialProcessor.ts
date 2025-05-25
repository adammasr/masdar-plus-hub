
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
