
import { Article } from "../context/ArticleContext";

// Enhanced AI reformatting service with translation support
export const reformatArticleWithAI = async (
  originalContent: string, 
  originalTitle: string,
  isTranslated: boolean = false,
  originalSource?: string
): Promise<{
  reformattedContent: string, 
  reformattedTitle: string, 
  generatedTags: string[],
  readingTime: number,
  discussionQuestion?: string
}> => {
  console.log("Reformatting content with AI:", originalTitle);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Enhanced title generation
  const reformattedTitle = generateBetterTitle(originalTitle, isTranslated);
  
  // Enhanced content reformatting
  const reformattedContent = generateBetterContent(originalContent, originalTitle, isTranslated, originalSource);
  
  // Generate relevant tags
  const generatedTags = generateContentTags(originalContent, originalTitle);
  
  // Calculate reading time
  const readingTime = estimateReadingTime(reformattedContent);
  
  // Generate discussion question
  const discussionQuestion = generateDiscussionQuestion(originalContent, originalTitle);
  
  return {
    reformattedContent,
    reformattedTitle,
    generatedTags,
    readingTime,
    discussionQuestion
  };
};

// Enhanced title generation with cleaner output
const generateBetterTitle = (originalTitle: string, isTranslated: boolean = false): string => {
  // Remove timestamps and dates first
  let cleanTitle = originalTitle
    .replace(/\d{1,2}‏\/\d{1,2}‏\/\d{2,4}\s*\d{1,2}:\d{1,2}:\d{1,2}\s*(ص|م)/g, '')
    .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '')
    .replace(/\d{1,2}-\d{1,2}-\d{2,4}/g, '')
    .replace(/من مصادر RSS/g, '')
    .replace(/أخبار عاجلة/g, '')
    .replace(/عاجل:/g, '')
    .replace(/-\s*$/g, '')
    .trim();

  // Remove common prefixes and suffixes
  cleanTitle = cleanTitle
    .replace(/(حصري|خاص|ننفرد|ننشر|تصريحات خاصة|انفراد|Breaking|Exclusive)/i, '')
    .replace(/\|\s*مصدر\s*بلس/g, '')
    .trim();

  // If title is too short, try to extract meaningful content
  if (cleanTitle.length < 10) {
    cleanTitle = originalTitle.replace(/[^\u0600-\u06FF\s]/g, '').trim();
  }

  // Generate contextual title based on content
  const titleKeywords = extractKeywords(cleanTitle);
  const contextualTitle = generateContextualTitle(titleKeywords, cleanTitle);
  
  // Ensure proper length (max 80 characters)
  let finalTitle = contextualTitle || cleanTitle;
  if (finalTitle.length > 80) {
    finalTitle = finalTitle.substring(0, 77) + '...';
  }
  
  return finalTitle;
};

// Extract keywords from title for better categorization
const extractKeywords = (title: string): string[] => {
  const keywords: string[] = [];
  const titleLower = title.toLowerCase();
  
  // Political keywords
  if (titleLower.match(/(رئيس|وزير|حكومة|برلمان|دبلوماسي|مجلس)/)) {
    keywords.push('سياسة');
  }
  
  // Economic keywords
  if (titleLower.match(/(اقتصاد|بنك|استثمار|أسعار|دولار|بورصة)/)) {
    keywords.push('اقتصاد');
  }
  
  // Technology keywords
  if (titleLower.match(/(ذكاء اصطناعي|تكنولوجيا|تقنية|رقمي|انترنت)/)) {
    keywords.push('تكنولوجيا');
  }
  
  // Sports keywords
  if (titleLower.match(/(رياضة|كرة|مباراة|فريق|بطولة|لاعب)/)) {
    keywords.push('رياضة');
  }
  
  // Health keywords
  if (titleLower.match(/(صحة|طب|مرض|علاج|مستشفى)/)) {
    keywords.push('صحة');
  }
  
  return keywords;
};

// Generate contextual professional title
const generateContextualTitle = (keywords: string[], originalTitle: string): string => {
  if (keywords.includes('سياسة')) {
    return `تطورات سياسية: ${originalTitle}`;
  }
  
  if (keywords.includes('اقتصاد')) {
    return `الأسواق: ${originalTitle}`;
  }
  
  if (keywords.includes('تكنولوجيا')) {
    return `تقنية: ${originalTitle}`;
  }
  
  if (keywords.includes('رياضة')) {
    return `رياضة: ${originalTitle}`;
  }
  
  if (keywords.includes('صحة')) {
    return `صحة: ${originalTitle}`;
  }
  
  return originalTitle;
};

// Enhanced content generation with better structure
const generateBetterContent = (
  originalContent: string, 
  originalTitle: string, 
  isTranslated: boolean = false,
  originalSource?: string
): string => {
  const cleanedContent = originalContent.replace(/<[^>]*>?/gm, '');
  
  // Create context-aware introduction
  let introContext = "وفقاً لمصادر موثوقة، ";
  if (isTranslated) {
    introContext = "في تطور مهم على الساحة العالمية، ";
  }
  
  // Structure content into better paragraphs
  const contentParagraphs = cleanedContent
    .split(/\n\n|\r\n\r\n/)
    .filter(para => para.trim().length > 0)
    .map(para => {
      // Add emphasis to key points
      const processedPara = para.replace(/(\d+%|\$\d+|\d+\s*(مليون|بليون|ألف))/g, '<strong>$1</strong>');
      return `<p>${processedPara.trim()}</p>`;
    })
    .join('\n\n');
  
  // Create source attribution
  let sourceAttribution = "";
  if (originalSource) {
    sourceAttribution = `<p class="source-attribution"><em>المصدر: ${originalSource}</em></p>`;
  }
  
  // Add conclusion based on content type
  const conclusionParagraph = generateConclusion(cleanedContent, isTranslated);
  
  const formattedContent = `
    <div class="article-content">
      <p><strong>${introContext}</strong>${cleanedContent.substring(0, 200)}...</p>
      ${contentParagraphs}
      ${sourceAttribution}
      ${conclusionParagraph}
    </div>
  `;
  
  return formattedContent;
};

// Generate contextual conclusion
const generateConclusion = (content: string, isTranslated: boolean): string => {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('ذكاء اصطناعي') || contentLower.includes('ai') || contentLower.includes('تكنولوجيا')) {
    return `<p><strong>وجهة نظر مصدر بلس:</strong> يعكس هذا التطور التقني أهمية مواكبة التطورات السريعة في عالم التكنولوجيا والذكاء الاصطناعي.</p>`;
  }
  
  if (contentLower.includes('اقتصاد') || contentLower.includes('مالي') || contentLower.includes('استثمار')) {
    return `<p><strong>التحليل الاقتصادي:</strong> هذا التطور قد يكون له تأثيرات واسعة على الأسواق والاستثمارات في المنطقة.</p>`;
  }
  
  if (isTranslated) {
    return `<p><em>تابعوا مصدر بلس للمزيد من الأخبار العالمية المترجمة والمحدثة لحظة بلحظة.</em></p>`;
  }
  
  return `<p><em>يواصل مصدر بلس متابعة آخر التطورات حول هذا الموضوع وسيوافيكم بالمستجدات فور ورودها.</em></p>`;
};

// Enhanced tag generation with more categories
const generateContentTags = (content: string, title: string): string[] => {
  const combinedText = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  // AI and Technology
  if (combinedText.match(/(ذكاء اصطناعي|ai|artificial intelligence|machine learning|تعلم آلي)/)) {
    tags.push("ذكاء_اصطناعي");
  }
  
  if (combinedText.match(/(تكنولوجيا|تقنية|technology|tech|رقمي|digital)/)) {
    tags.push("تكنولوجيا");
  }
  
  // Politics and Government
  if (combinedText.match(/(رئيس|وزير|حكومة|برلمان|سياسة|دبلوماسي|president|minister)/)) {
    tags.push("سياسة");
  }
  
  // Economy and Finance
  if (combinedText.match(/(اقتصاد|مالية|استثمار|بورصة|أسهم|بنوك|أسعار|economy|finance)/)) {
    tags.push("اقتصاد");
  }
  
  // Sports
  if (combinedText.match(/(رياضة|كرة|مباراة|لاعب|فريق|بطولة|sports|football|soccer)/)) {
    tags.push("رياضة");
  }
  
  // Health and Medicine
  if (combinedText.match(/(صحة|طب|مرض|علاج|مستشفى|وباء|health|medical|medicine)/)) {
    tags.push("صحة");
  }
  
  // Military and Defense
  if (combinedText.match(/(عسكري|دفاع|أمني|جيش|قوات|military|defense|army|security)/)) {
    tags.push("دفاع_وأمن");
  }
  
  // Science and Research
  if (combinedText.match(/(علم|بحث|دراسة|اكتشاف|science|research|discovery)/)) {
    tags.push("علوم");
  }
  
  // International Affairs
  if (combinedText.match(/(دولي|عالمي|international|global|worldwide)/)) {
    tags.push("شؤون_دولية");
  }
  
  // Add default tag if none detected
  if (tags.length === 0) {
    tags.push("أخبار");
  }
  
  return tags;
};

// Generate discussion questions
const generateDiscussionQuestion = (content: string, title: string): string => {
  const combinedText = `${title} ${content}`.toLowerCase();
  
  if (combinedText.includes('ذكاء اصطناعي') || combinedText.includes('ai')) {
    return "كيف ترى تأثير هذا التطور في الذكاء الاصطناعي على مستقبل التكنولوجيا؟";
  }
  
  if (combinedText.includes('اقتصاد') || combinedText.includes('مالي')) {
    return "ما رأيك في التأثيرات الاقتصادية المحتملة لهذا القرار؟";
  }
  
  if (combinedText.includes('سياسة') || combinedText.includes('حكومة')) {
    return "هل تعتقد أن هذا القرار السياسي سيحقق النتائج المرجوة؟";
  }
  
  if (combinedText.includes('رياضة') || combinedText.includes('مباراة')) {
    return "ما توقعاتك لأداء الفريق في المباريات القادمة؟";
  }
  
  return "ما رأيك في هذا التطور وتأثيره على المستقبل؟";
};

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

// Get contextual image from Unsplash based on content
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

// Calculate reading time
export const estimateReadingTime = (content: string): number => {
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const wordCount = plainText.split(/\s+/).length;
  const wordsPerMinute = 220; // Arabic reading speed
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
};

// Enhanced article processing
export const updateArticleDate = (article: Article): Article => {
  const today = new Date().toISOString().split('T')[0];
  return {
    ...article,
    date: today
  };
};

export const ensureArticleHasImage = (article: Article): Article => {
  if (!article.image || article.image.includes("placehold.co")) {
    const extractedImage = extractImageFromContent(article.content, "");
    return {
      ...article,
      image: extractedImage
    };
  }
  return article;
};

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

// Translation functionality (to be implemented with actual translation API)
export const translateContent = async (
  content: string, 
  title: string, 
  fromLang: string = 'en', 
  toLang: string = 'ar'
): Promise<{translatedContent: string, translatedTitle: string}> => {
  // This would integrate with a real translation API like Google Translate
  // For now, return the content as-is with a note
  console.log(`Translation requested: ${fromLang} -> ${toLang}`);
  
  // Simulate translation delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In production, this would call an actual translation API
  return {
    translatedContent: content,
    translatedTitle: title
  };
};
