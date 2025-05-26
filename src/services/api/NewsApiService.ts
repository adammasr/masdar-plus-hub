
import axios from 'axios';
import { NewsItem } from '../../types/NewsItem';
import { getContextualImage } from '../../utils/imageExtractor';

/**
 * خدمة NewsAPI و NewsData.io محسنة
 */
export class NewsApiService {
  private static instance: NewsApiService | null = null;
  
  // مفاتيح API
  private newsApiKey = '3b081dbd20914fa593eadcce3b88dac3';
  private newsDataApiKey = 'pub_ae32bb142b1249c5975f2dcfe75a4ed9';
  
  private constructor() {}

  public static getInstance(): NewsApiService {
    if (!NewsApiService.instance) {
      NewsApiService.instance = new NewsApiService();
    }
    return NewsApiService.instance;
  }

  /**
   * جلب جميع الأخبار من المصادر المختلفة
   */
  public async fetchAllNews(): Promise<NewsItem[]> {
    try {
      console.log('🚀 بدء جلب الأخبار من NewsAPI و NewsData...');
      
      const allNews: NewsItem[] = [];
      
      // جلب من NewsAPI
      const newsApiResults = await this.fetchFromNewsAPI();
      allNews.push(...newsApiResults);
      
      // جلب من NewsData بفئات مختلفة
      const newsDataResults = await this.fetchFromNewsData();
      allNews.push(...newsDataResults);
      
      console.log(`✅ تم جلب ${allNews.length} خبر من جميع المصادر`);
      return allNews;
      
    } catch (error) {
      console.error('خطأ في جلب الأخبار:', error);
      return [];
    }
  }

  /**
   * جلب الأخبار من NewsAPI
   */
  private async fetchFromNewsAPI(): Promise<NewsItem[]> {
    const sources = [
      'al-ahram-com-eg',
      'masrawy-com',
      'youm7-com'
    ];
    
    const keywords = ['مصر', 'القاهرة', 'الحكومة المصرية', 'المنوفية'];
    const results: NewsItem[] = [];
    
    for (const keyword of keywords) {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: keyword,
            language: 'ar',
            sortBy: 'publishedAt',
            pageSize: 10,
            apiKey: this.newsApiKey
          },
          timeout: 10000
        });
        
        if (response.data.articles) {
          const processedArticles = response.data.articles.map(article => 
            this.processNewsApiArticle(article, keyword)
          );
          results.push(...processedArticles);
        }
        
        // تأخير قصير بين الطلبات
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`فشل في جلب أخبار ${keyword} من NewsAPI:`, error);
      }
    }
    
    return results;
  }

  /**
   * جلب الأخبار من NewsData.io
   */
  private async fetchFromNewsData(): Promise<NewsItem[]> {
    const categories = [
      { q: 'المنوفية', category: 'محافظات' },
      { q: 'الحكومة والوزارات المصرية', category: 'سياسة' },
      { q: 'الأخبار العربية', category: 'أخبار' },
      { q: 'الأخبار العسكرية العربية', category: 'عسكرية' },
      { q: 'أخبار الذكاء الاصطناعي', category: 'ذكاء اصطناعي' },
      { q: 'أخبار الرياضة', category: 'رياضة' },
      { q: 'أخبار الاقتصاد', category: 'اقتصاد' },
      { q: 'أخبار مصر', category: 'أخبار' }
    ];
    
    const results: NewsItem[] = [];
    
    for (const { q, category } of categories) {
      try {
        const response = await axios.get('https://newsdata.io/api/1/latest', {
          params: {
            apikey: this.newsDataApiKey,
            q: q,
            language: 'ar',
            timezone: 'Africa/Cairo',
            size: 10
          },
          timeout: 10000
        });
        
        if (response.data.results) {
          const processedArticles = response.data.results.map(article => 
            this.processNewsDataArticle(article, category)
          );
          results.push(...processedArticles);
        }
        
        // تأخير قصير بين الطلبات
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.warn(`فشل في جلب أخبار ${q} من NewsData:`, error);
      }
    }
    
    return results;
  }

  /**
   * معالجة مقال من NewsAPI
   */
  private processNewsApiArticle(article: any, keyword: string): NewsItem {
    // تنظيف العنوان من التواريخ والمصادر غير المرغوب فيها
    const cleanTitle = this.cleanTitle(article.title || 'خبر جديد');
    
    // استخراج أو توليد صورة مناسبة
    const image = this.getArticleImage(article.urlToImage, article.content, keyword);
    
    // تحديد الفئة بناءً على المحتوى
    const category = this.determineCategory(cleanTitle + ' ' + (article.description || ''), keyword);
    
    return {
      id: this.generateId(),
      title: cleanTitle,
      content: article.content || article.description || 'محتوى الخبر غير متوفر',
      excerpt: this.createExcerpt(article.description || article.content || ''),
      image: image,
      category: category,
      date: new Date().toISOString().split('T')[0],
      source: 'NewsAPI',
      featured: Math.random() < 0.1, // 10% احتمال أن يكون مميز
      isTranslated: false,
      readingTime: this.calculateReadingTime(article.content || article.description || ''),
      tags: this.generateTags(cleanTitle, category)
    };
  }

  /**
   * معالجة مقال من NewsData
   */
  private processNewsDataArticle(article: any, category: string): NewsItem {
    // تنظيف العنوان
    const cleanTitle = this.cleanTitle(article.title || 'خبر جديد');
    
    // استخراج أو توليد صورة مناسبة
    const image = this.getArticleImage(article.image_url, article.content, category);
    
    return {
      id: this.generateId(),
      title: cleanTitle,
      content: article.content || article.description || 'محتوى الخبر غير متوفر',
      excerpt: this.createExcerpt(article.description || article.content || ''),
      image: image,
      category: category,
      date: new Date().toISOString().split('T')[0],
      source: 'NewsData',
      featured: Math.random() < 0.15, // 15% احتمال أن يكون مميز
      isTranslated: false,
      readingTime: this.calculateReadingTime(article.content || article.description || ''),
      tags: this.generateTags(cleanTitle, category)
    };
  }

  /**
   * تنظيف العنوان من التواريخ والمصادر غير المرغوب فيها
   */
  private cleanTitle(title: string): string {
    return title
      // إزالة التواريخ والأوقات
      .replace(/\d{1,2}‏\/\d{1,2}‏\/\d{2,4}\s*\d{1,2}:\d{1,2}:\d{1,2}\s*(ص|م)/g, '')
      .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '')
      .replace(/\d{1,2}-\d{1,2}-\d{2,4}/g, '')
      // إزالة المصادر غير المرغوب فيها
      .replace(/من مصادر RSS/gi, '')
      .replace(/أخبار عاجلة من مصادر RSS/gi, '')
      .replace(/منشور جديد من صفحة فيسبوك/gi, '')
      .replace(/خبر من صفحات فيسبوك/gi, '')
      .replace(/من مصدر RSS/gi, '')
      .replace(/عاجل:/gi, '')
      .replace(/حصري/gi, '')
      .replace(/Breaking/gi, '')
      .replace(/\|\s*مصدر\s*بلس/gi, '')
      // تنظيف عام
      .replace(/-\s*$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * الحصول على صورة مناسبة للمقال
   */
  private getArticleImage(originalImage: string | null, content: string, category: string): string {
    // إذا كانت هناك صورة أصلية صالحة
    if (originalImage && this.isValidImageUrl(originalImage)) {
      return originalImage;
    }
    
    // استخدام صورة سياقية بناءً على الفئة والمحتوى
    return getContextualImage(content + ' ' + category);
  }

  /**
   * التحقق من صحة رابط الصورة
   */
  private isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    // تحقق من صيغة URL صحيحة
    try {
      new URL(url);
    } catch {
      return false;
    }
    
    // تحقق من امتداد الصورة
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const urlLower = url.toLowerCase();
    
    return imageExtensions.some(ext => urlLower.includes(ext)) || 
           urlLower.includes('image') || 
           urlLower.includes('photo');
  }

  /**
   * تحديد فئة المقال
   */
  private determineCategory(content: string, keyword: string): string {
    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('ذكاء اصطناعي') || lowerContent.includes('ذكاء اصطناعي') || lowerContent.includes('ai')) {
      return 'ذكاء اصطناعي';
    }
    if (lowerKeyword.includes('رياضة') || lowerContent.includes('رياضة') || lowerContent.includes('كرة')) {
      return 'رياضة';
    }
    if (lowerKeyword.includes('اقتصاد') || lowerContent.includes('اقتصاد') || lowerContent.includes('استثمار')) {
      return 'اقتصاد';
    }
    if (lowerKeyword.includes('عسكري') || lowerContent.includes('جيش') || lowerContent.includes('عسكري')) {
      return 'عسكرية';
    }
    if (lowerKeyword.includes('محافظ') || lowerContent.includes('محافظة') || lowerContent.includes('المنوفية')) {
      return 'محافظات';
    }
    if (lowerContent.includes('حكومة') || lowerContent.includes('وزير') || lowerContent.includes('رئيس')) {
      return 'سياسة';
    }
    
    return 'أخبار';
  }

  /**
   * إنشاء مقتطف
   */
  private createExcerpt(content: string, maxLength: number = 150): string {
    if (!content) return 'مقتطف غير متوفر';
    
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (cleanContent.length <= maxLength) return cleanContent;
    
    let truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.7) {
      truncated = truncated.substring(0, lastSpace);
    }
    
    return truncated + '...';
  }

  /**
   * حساب وقت القراءة
   */
  private calculateReadingTime(content: string): number {
    if (!content) return 1;
    
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  /**
   * إنشاء تاجات
   */
  private generateTags(title: string, category: string): string[] {
    const tags = [category];
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('مصر')) tags.push('مصر');
    if (titleLower.includes('القاهرة')) tags.push('القاهرة');
    if (titleLower.includes('حكومة')) tags.push('حكومة');
    if (titleLower.includes('رئيس')) tags.push('رئاسة');
    
    return [...new Set(tags)].slice(0, 5);
  }

  /**
   * توليد ID فريد
   */
  private generateId(): string {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
  }
}

export default NewsApiService;
