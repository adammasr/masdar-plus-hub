
import { Article } from "../context/ArticleContext";
import { generateContentTags } from "./contentTagging";
import { estimateReadingTime } from "./textUtils";
import { extractImageFromContent } from "./imageExtractor";

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
