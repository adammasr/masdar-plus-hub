
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

// Enhanced title generation with translation awareness
const generateBetterTitle = (originalTitle: string, isTranslated: boolean = false): string => {
  let cleanTitle = originalTitle.replace(/(حصري|خاص|ننفرد|ننشر|تصريحات خاصة|انفراد|Breaking|Exclusive)/i, '').trim();
  
  // Remove date references
  cleanTitle = cleanTitle.replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '').trim();
  
  // Get contextual prefix
  const titlePrefix = getContextualPrefix(cleanTitle);
  
  // Add translation indicator if needed
  let finalTitle = titlePrefix ? `${titlePrefix} ${cleanTitle}` : cleanTitle;
  
  // Ensure proper length
  if (finalTitle.length > 80) {
    finalTitle = cleanTitle.length > 80 ? cleanTitle.substring(0, 77) + '...' : cleanTitle;
  }
  
  return `${finalTitle} | مصدر بلس`;
};

// Enhanced contextual prefix with more categories
const getContextualPrefix = (title: string): string => {
  if (title.match(/(عاجل|خطير|تطور|تحديث|urgent|breaking)/i)) {
    return "عاجل:";
  }
  
  if (title.match(/(تقرير|دراسة|تحليل|استطلاع|report|analysis)/i)) {
    return "تقرير:";
  }
  
  if (title.match(/(يؤكد|أكد|صرح|تصريح|confirms|statement)/i)) {
    return "تصريح:";
  }
  
  if (title.match(/(إنجاز|خطوة|تقدم|تطور إيجابي|achievement|progress)/i)) {
    return "متابعة:";
  }
  
  if (title.match(/(ذكاء اصطناعي|AI|تكنولوجيا|تقنية|technology)/i)) {
    return "تقنية:";
  }
  
  if (title.match(/(عسكري|دفاع|أمني|military|defense|security)/i)) {
    return "دفاع:";
  }
  
  return "";
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

// Enhanced image extraction with better fallbacks
export const extractImageFromContent = (content: string, fallbackImage: string): string => {
  // Try Open Graph images first
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
  
  // High-quality fallback images for different categories
  const fallbackImages = {
    tech: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop&q=60",
    ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    politics: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=60",
    economy: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
    sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
    military: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800&auto=format&fit=crop&q=60",
    default: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60"
  };
  
  // Select appropriate fallback based on content
  const contentLower = content.toLowerCase();
  if (contentLower.includes('ذكاء اصطناعي') || contentLower.includes('ai')) {
    return fallbackImages.ai;
  } else if (contentLower.includes('تكنولوجيا')) {
    return fallbackImages.tech;
  } else if (contentLower.includes('سياسة')) {
    return fallbackImages.politics;
  } else if (contentLower.includes('اقتصاد')) {
    return fallbackImages.economy;
  } else if (contentLower.includes('رياضة')) {
    return fallbackImages.sports;
  } else if (contentLower.includes('عسكري') || contentLower.includes('دفاع')) {
    return fallbackImages.military;
  }
  
  return fallbackImages.default;
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
  
  // Enhanced image extraction
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
