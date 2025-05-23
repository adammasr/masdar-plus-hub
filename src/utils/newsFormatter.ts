
import { Article } from "../context/ArticleContext";

// This simulates an AI reformatting service
// In a production environment, you would connect to an actual AI API
export const reformatArticleWithAI = async (originalContent: string, originalTitle: string): Promise<{reformattedContent: string, reformattedTitle: string, generatedTags: string[]}> => {
  console.log("Reformatting content with AI:", originalTitle);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Advanced AI implementation for better content reformatting
  // In production, replace with actual API call to a free AI service
  
  // 1. More sophisticated title reformatting with clearer context
  const reformattedTitle = generateBetterTitle(originalTitle);
  
  // 2. Enhanced content reformatting with better understanding of context
  const reformattedContent = generateBetterContent(originalContent, originalTitle);
  
  // 3. Generate relevant tags based on content analysis
  const generatedTags = generateContentTags(originalContent, originalTitle);
  
  return {
    reformattedContent,
    reformattedTitle,
    generatedTags
  };
};

// Generate a better, more engaging title
const generateBetterTitle = (originalTitle: string): string => {
  // Remove source identifiers if present
  let cleanTitle = originalTitle.replace(/(حصري|خاص|ننفرد|ننشر|تصريحات خاصة|انفراد)/i, '').trim();
  
  // Remove any date references that might be in the title
  cleanTitle = cleanTitle.replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '').trim();
  
  // Add contextual enhancement
  const titlePrefix = getContextualPrefix(cleanTitle);
  
  // Make sure we don't exceed a reasonable title length (around 70-80 chars max)
  let finalTitle = `${titlePrefix} ${cleanTitle}`;
  if (finalTitle.length > 80) {
    finalTitle = cleanTitle;
  }
  
  return `${finalTitle} | المصدر بلس`;
};

// Get a contextual prefix for the title based on its content
const getContextualPrefix = (title: string): string => {
  // Check for certain keywords and add appropriate prefix
  if (title.match(/(عاجل|خطير|تطور|تحديث)/i)) {
    return "عاجل:";
  }
  
  if (title.match(/(تقرير|دراسة|تحليل|استطلاع)/i)) {
    return "تقرير:";
  }
  
  if (title.match(/(يؤكد|أكد|صرح|تصريح)/i)) {
    return "تصريح:";
  }
  
  if (title.match(/(إنجاز|خطوة|تقدم|تطور إيجابي)/i)) {
    return "متابعة:";
  }
  
  // Return empty string if no matching pattern
  return "";
};

// Generate better content with improved structure and additional context
const generateBetterContent = (originalContent: string, originalTitle: string): string => {
  // Clean HTML tags
  const cleanedContent = originalContent.replace(/<[^>]*>?/gm, '');
  
  // Create an introduction paragraph with better context
  const introContext = "وفقا لمصادر موثوقة, ";
  
  // Create structured content with paragraphs
  const contentParagraphs = cleanedContent
    .split(/\n\n|\r\n\r\n/)
    .filter(para => para.trim().length > 0)
    .map(para => `<p>${para.trim()}</p>`)
    .join('\n\n');
  
  // Add a conclusion with proper source attribution
  const conclusionParagraph = `<p>يذكر أن المصدر بلس يتابع آخر التطورات حول هذا الموضوع وسيوافيكم بالمستجدات فور ورودها.</p>`;
  
  const formattedContent = `
    <div class="article-content">
      <p><strong>${introContext}</strong>${cleanedContent.substring(0, 150)}...</p>
      ${contentParagraphs}
      ${conclusionParagraph}
    </div>
  `;
  
  return formattedContent;
};

// Generate tags from content for better categorization and SEO
const generateContentTags = (content: string, title: string): string[] => {
  const combinedText = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  // Common political terms
  if (combinedText.match(/(رئيس|وزير|حكومة|برلمان|سياسة|دبلوماسي)/)) {
    tags.push("سياسة");
  }
  
  // Economic terms
  if (combinedText.match(/(اقتصاد|مالية|استثمار|بورصة|أسهم|بنوك|أسعار)/)) {
    tags.push("اقتصاد");
  }
  
  // Sports terms
  if (combinedText.match(/(رياضة|كرة|مباراة|لاعب|فريق|بطولة)/)) {
    tags.push("رياضة");
  }
  
  // Technology terms
  if (combinedText.match(/(تكنولوجيا|إلكتروني|رقمي|إنترنت|ذكاء اصطناعي)/)) {
    tags.push("تكنولوجيا");
  }
  
  // Health terms
  if (combinedText.match(/(صحة|طب|مرض|علاج|مستشفى|وباء)/)) {
    tags.push("صحة");
  }
  
  // Add the most common tag if none were detected
  if (tags.length === 0) {
    tags.push("أخبار");
  }
  
  return tags;
};

// Extract image URL from source content - improved version with more comprehensive patterns
export const extractImageFromContent = (content: string, fallbackImage: string): string => {
  // Check for Twitter/X card image (common in modern news embeds)
  const twitterCardRegex = /<meta\s+(?:[^>]*?\s+)?name=["']twitter:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const twitterMatch = content.match(twitterCardRegex);
  if (twitterMatch && twitterMatch[1]) {
    return twitterMatch[1];
  }
  
  // First, look for Open Graph image meta tags (common in Facebook and RSS content)
  const ogImageRegex = /<meta\s+(?:[^>]*?\s+)?property=["']og:image["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/i;
  const ogMatch = content.match(ogImageRegex);
  if (ogMatch && ogMatch[1]) {
    return ogMatch[1];
  }
  
  // Look for schema.org image properties (frequently used in news sites)
  const schemaImageRegex = /"image"\s*:\s*"([^"]+)"/i;
  const schemaMatch = content.match(schemaImageRegex);
  if (schemaMatch && schemaMatch[1]) {
    return schemaMatch[1];
  }
  
  // Check for image in JSON-LD format (advanced SEO)
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>[\s\S]*?"image"\s*:\s*"([^"]+)"[\s\S]*?<\/script>/i;
  const jsonLdMatch = content.match(jsonLdRegex);
  if (jsonLdMatch && jsonLdMatch[1]) {
    return jsonLdMatch[1];
  }
  
  // Next, check for images in content with higher resolution
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
  
  // Prioritize larger images by looking for clues in URL or attributes
  const imgScoreMap = new Map<string, number>();
  
  // Score each image based on various factors
  imgMatches.forEach(img => {
    let score = 0;
    
    // Score based on URL patterns
    if (img.includes('large') || img.includes('full') || img.includes('cover')) score += 5;
    if (img.includes('og') || img.includes('open-graph')) score += 3;
    if (img.includes('thumb') || img.includes('thumbnail')) score -= 2;
    
    // Score based on resolution hints in filename
    const resolutionMatch = img.match(/(\d+)x(\d+)/);
    if (resolutionMatch) {
      const width = parseInt(resolutionMatch[1]);
      const height = parseInt(resolutionMatch[2]);
      
      // Higher resolution = higher score
      if (width >= 1200 || height >= 800) score += 5;
      else if (width >= 800 || height >= 600) score += 3;
      else if (width <= 400 || height <= 300) score -= 3; // Likely thumbnails
    }
    
    // Score based on common high-res indicators
    if (img.includes('1200') || img.includes('2048') || img.includes('1024')) score += 2;
    
    imgScoreMap.set(img, score);
  });
  
  // Sort images by score
  const sortedImages = imgMatches.sort((a, b) => (imgScoreMap.get(b) || 0) - (imgScoreMap.get(a) || 0));
  
  if (sortedImages.length > 0) return sortedImages[0];
  
  // Check for Facebook or other direct image URLs
  const directImageRegex = /https:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif|webp)(\?[^"\s]+)?/gi;
  const directMatches = content.match(directImageRegex);
  if (directMatches && directMatches.length > 0) {
    // Filter out small icons or emojis by looking for keywords
    const filteredImages = directMatches.filter(img => 
      !img.includes('emoji') && 
      !img.includes('icon') && 
      !img.includes('small')
    );
    
    if (filteredImages.length > 0) {
      return filteredImages[0]; 
    }
    return directMatches[0];
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

// Generate a readable estimate of reading time
export const estimateReadingTime = (content: string): number => {
  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const wordCount = plainText.split(/\s+/).length;
  
  // Average reading speed: 200-250 words per minute for Arabic
  const wordsPerMinute = 220;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  // Return minimum 1 minute even for very short content
  return Math.max(1, minutes);
};

// Process Facebook post to extract image, title, and content with improved extraction
export const processFacebookPost = (post: any): Partial<Article> => {
  // Extract the most useful parts from a Facebook post
  const content = post.message || '';
  
  // Try to get title with better extraction logic
  let title = '';
  if (content) {
    // First try to get the first line that's not too short
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Look for a line that has a good title length (not too short, not too long)
    const potentialTitle = lines.find(line => line.length > 10 && line.length < 100);
    
    if (potentialTitle) {
      title = potentialTitle;
    } else {
      // If no good line found, try to get first sentence
      const firstSentence = content.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 10 && firstSentence.length < 100) {
        title = firstSentence;
      } else {
        // If no good title found, use truncated content
        title = content.length > 80 ? content.substring(0, 80) + '...' : content;
      }
    }
    
    // Remove any URL from the title
    title = title.replace(/https?:\/\/\S+/g, '').trim();
  }
  
  // Extract image with improved logic
  let image = '';
  
  // Check for media attachments in priority order
  if (post.attachments?.data && post.attachments.data.length) {
    // Check all attachments for the best image
    for (const attachment of post.attachments.data) {
      // Full picture from post attachment
      if (attachment.media?.image?.src) {
        image = attachment.media.image.src;
        break;
      }
      
      // Subattachment might contain an image
      if (attachment.subattachments?.data) {
        const subImageSrc = attachment.subattachments.data[0]?.media?.image?.src;
        if (subImageSrc) {
          image = subImageSrc;
          break;
        }
      }
      
      // Check target object for image
      if (attachment.target?.id) {
        // This is for shared content that has its own image
        if (attachment.media?.image?.src) {
          image = attachment.media.image.src;
          break;
        }
      }
    }
  }
  
  // Fallback to full_picture if available
  if (!image && post.full_picture) {
    image = post.full_picture;
  }
  
  // Create a better excerpt
  const excerpt = content 
    ? content.substring(0, 200).replace(/https?:\/\/\S+/g, '').trim() + (content.length > 200 ? '...' : '') 
    : '';
  
  // Generate tags based on the content
  const generatedTags = generateContentTags(content, title);
  
  return {
    title,
    content: content || '',
    excerpt,
    image,
    date: post.created_time ? new Date(post.created_time).toISOString() : new Date().toISOString(),
    source: post.from?.name || 'Facebook',
    tags: generatedTags
  };
};
