
// Translation service for international RSS feeds
interface TranslationResult {
  translatedContent: string;
  translatedTitle: string;
  confidence: number;
}

// Google Translate API integration
export const translateWithGoogle = async (
  text: string,
  targetLang: string = 'ar',
  sourceLang: string = 'en'
): Promise<string> => {
  const API_KEY = 'AIzaSyAzQEejlpDswE6uoLVWUkUgSh_VNT0FlP0'; // Your provided API key
  
  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Enhanced article translation with context preservation
export const translateArticle = async (
  title: string,
  content: string,
  excerpt: string,
  sourceLang: string = 'en'
): Promise<TranslationResult> => {
  try {
    console.log('Starting translation process...');
    
    // Translate title
    const translatedTitle = await translateWithGoogle(title, 'ar', sourceLang);
    
    // Clean and prepare content for translation
    const cleanContent = content.replace(/<[^>]*>/g, '');
    
    // Split content into chunks to avoid API limits
    const chunks = splitTextIntoChunks(cleanContent, 4000);
    const translatedChunks = [];
    
    for (const chunk of chunks) {
      const translatedChunk = await translateWithGoogle(chunk, 'ar', sourceLang);
      translatedChunks.push(translatedChunk);
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const translatedContent = translatedChunks.join(' ');
    
    // Calculate confidence based on content length and successful translation
    const confidence = calculateTranslationConfidence(content, translatedContent);
    
    console.log('Translation completed successfully');
    
    return {
      translatedContent,
      translatedTitle,
      confidence
    };
  } catch (error) {
    console.error('Translation service error:', error);
    
    // Return original content with low confidence if translation fails
    return {
      translatedContent: content,
      translatedTitle: title,
      confidence: 0.1
    };
  }
};

// Split text into manageable chunks for translation
const splitTextIntoChunks = (text: string, maxChunkSize: number): string[] => {
  const sentences = text.split(/[.!?]+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        // If single sentence is too long, split by words
        const words = sentence.split(' ');
        let wordChunk = '';
        
        for (const word of words) {
          if (wordChunk.length + word.length > maxChunkSize) {
            if (wordChunk) {
              chunks.push(wordChunk.trim());
              wordChunk = word;
            }
          } else {
            wordChunk += ' ' + word;
          }
        }
        
        if (wordChunk) {
          currentChunk = wordChunk;
        }
      }
    } else {
      currentChunk += sentence + '.';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 0);
};

// Calculate translation confidence score
const calculateTranslationConfidence = (original: string, translated: string): number => {
  // Basic confidence calculation based on length ratio and content preservation
  const lengthRatio = translated.length / original.length;
  
  // Arabic text is usually longer than English, so expect 1.2-1.8x length
  let lengthScore = 1.0;
  if (lengthRatio >= 1.2 && lengthRatio <= 1.8) {
    lengthScore = 1.0;
  } else if (lengthRatio >= 1.0 && lengthRatio < 1.2) {
    lengthScore = 0.8;
  } else if (lengthRatio > 1.8 && lengthRatio <= 2.2) {
    lengthScore = 0.8;
  } else {
    lengthScore = 0.6;
  }
  
  // Check if translation contains Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  const hasArabic = arabicRegex.test(translated);
  const arabicScore = hasArabic ? 1.0 : 0.2;
  
  // Combined confidence score
  return Math.min(lengthScore * arabicScore, 1.0);
};

// Detect source language
export const detectLanguage = async (text: string): Promise<string> => {
  // Simple language detection based on character sets
  const arabicRegex = /[\u0600-\u06FF]/;
  const latinRegex = /[a-zA-Z]/;
  
  const arabicMatches = (text.match(arabicRegex) || []).length;
  const latinMatches = (text.match(latinRegex) || []).length;
  
  if (arabicMatches > latinMatches) {
    return 'ar';
  } else if (latinMatches > 0) {
    return 'en';
  }
  
  return 'auto';
};

// International RSS sources configuration
export const internationalRSSSources = [
  // AI and Technology
  {
    name: "MIT Technology Review - AI",
    url: "https://www.technologyreview.com/artificial-intelligence/feed/",
    category: "ذكاء_اصطناعي",
    language: "en"
  },
  {
    name: "TechCrunch - AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "ذكاء_اصطناعي",
    language: "en"
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "ذكاء_اصطناعي",
    language: "en"
  },
  {
    name: "Google AI Blog",
    url: "https://ai.googleblog.com/feeds/posts/default?alt=rss",
    category: "ذكاء_اصطناعي",
    language: "en"
  },
  
  // Military and Defense
  {
    name: "Defense News",
    url: "https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml",
    category: "دفاع_وأمن",
    language: "en"
  },
  {
    name: "Breaking Defense",
    url: "https://breakingdefense.com/feed/",
    category: "دفاع_وأمن",
    language: "en"
  },
  {
    name: "The War Zone",
    url: "https://www.thedrive.com/the-war-zone/feed",
    category: "دفاع_وأمن",
    language: "en"
  },
  
  // Sports
  {
    name: "ESPN News",
    url: "https://www.espn.com/espn/rss/news",
    category: "رياضة",
    language: "en"
  },
  {
    name: "Sky Sports Football",
    url: "https://www.skysports.com/rss/football",
    category: "رياضة",
    language: "en"
  },
  {
    name: "BBC Sport Football",
    url: "http://feeds.bbci.co.uk/sport/football/rss.xml",
    category: "رياضة",
    language: "en"
  }
];

// Process international RSS feed
export const processInternationalRSSFeed = async (
  feedData: any,
  sourceName: string,
  category: string,
  language: string = 'en'
): Promise<any[]> => {
  const processedArticles = [];
  
  for (const item of feedData.items || []) {
    try {
      // Detect if translation is needed
      const needsTranslation = language !== 'ar';
      
      let processedTitle = item.title || '';
      let processedContent = item.content || item.description || '';
      let processedExcerpt = item.summary || processedContent.substring(0, 200);
      
      // Translate if needed
      if (needsTranslation && (processedTitle || processedContent)) {
        const translationResult = await translateArticle(
          processedTitle,
          processedContent,
          processedExcerpt,
          language
        );
        
        if (translationResult.confidence > 0.5) {
          processedTitle = translationResult.translatedTitle;
          processedContent = translationResult.translatedContent;
        }
      }
      
      // Extract image
      const imageUrl = extractImageFromInternationalContent(item);
      
      const processedArticle = {
        title: processedTitle,
        content: processedContent,
        excerpt: processedExcerpt.substring(0, 200),
        image: imageUrl,
        category: category,
        date: item.pubDate || item.published || new Date().toISOString(),
        source: sourceName,
        originalSource: sourceName,
        isTranslated: needsTranslation,
        language: needsTranslation ? 'ar' : language,
        originalLanguage: language,
        originalUrl: item.link || ''
      };
      
      processedArticles.push(processedArticle);
      
    } catch (error) {
      console.error(`Error processing article from ${sourceName}:`, error);
    }
  }
  
  return processedArticles;
};

// Extract images from international RSS content
const extractImageFromInternationalContent = (item: any): string => {
  // Try different image fields common in RSS feeds
  if (item.enclosure && item.enclosure.url && item.enclosure.type?.includes('image')) {
    return item.enclosure.url;
  }
  
  if (item['media:content'] && item['media:content'].url) {
    return item['media:content'].url;
  }
  
  if (item['media:thumbnail'] && item['media:thumbnail'].url) {
    return item['media:thumbnail'].url;
  }
  
  // Try to extract from content
  if (item.content || item.description) {
    const content = item.content || item.description;
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  // Return category-specific fallback
  const fallbacks = {
    'ذكاء_اصطناعي': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    'دفاع_وأمن': 'https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800&auto=format&fit=crop&q=60',
    'رياضة': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60',
    'default': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60'
  };
  
  return fallbacks[item.category] || fallbacks.default;
};
