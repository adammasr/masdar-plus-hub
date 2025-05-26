
import { NewsItem } from '../../types/NewsItem';
import { NewsApiService } from './NewsApiService';
import { RssService } from './RssService';
import { GeminiService } from './GeminiService';
import { ImageService } from './ImageService';
import { toast } from 'sonner';

/**
 * خدمة الأخبار المحسنة - تجمع جميع مصادر الأخبار وتطبق الذكاء الاصطناعي
 */
export class EnhancedNewsService {
  private static instance: EnhancedNewsService | null = null;
  private isProcessing: boolean = false;
  
  // الخدمات المستخدمة
  private newsApiService: NewsApiService;
  private rssService: RssService;
  private geminiService: GeminiService;
  private imageService: ImageService;

  private constructor() {
    this.newsApiService = NewsApiService.getInstance();
    this.rssService = RssService.getInstance();
    this.geminiService = GeminiService.getInstance();
    this.imageService = ImageService.getInstance();
  }

  public static getInstance(): EnhancedNewsService {
    if (!EnhancedNewsService.instance) {
      EnhancedNewsService.instance = new EnhancedNewsService();
    }
    return EnhancedNewsService.instance;
  }

  /**
   * جلب ومعالجة جميع الأخبار من كافة المصادر
   */
  public async fetchAndProcessAllNews(): Promise<NewsItem[]> {
    if (this.isProcessing) {
      console.log('⏳ المعالجة قيد التنفيذ بالفعل...');
      return [];
    }

    this.isProcessing = true;
    
    try {
      console.log('🚀 بدء جلب ومعالجة الأخبار من جميع المصادر...');
      
      const allNewsItems: NewsItem[] = [];
      
      // جلب الأخبار من جميع المصادر بشكل متوازي
      const [newsApiItems, rssItems] = await Promise.allSettled([
        this.newsApiService.fetchAllNews(),
        this.rssService.fetchAllFeeds()
      ]);
      
      // دمج النتائج
      if (newsApiItems.status === 'fulfilled') {
        allNewsItems.push(...newsApiItems.value);
        console.log(`📡 تم جلب ${newsApiItems.value.length} خبر من NewsAPI & NewsData`);
      }
      
      if (rssItems.status === 'fulfilled') {
        allNewsItems.push(...rssItems.value);
        console.log(`📰 تم جلب ${rssItems.value.length} خبر من RSS`);
      }
      
      // إزالة المكررات
      const uniqueNews = this.removeDuplicates(allNewsItems);
      console.log(`🔄 تمت إزالة ${allNewsItems.length - uniqueNews.length} خبر مكرر`);
      
      // معالجة الأخبار بالذكاء الاصطناعي
      const processedNews = await this.processNewsWithAI(uniqueNews);
      
      // معالجة الصور
      const finalNews = await this.imageService.processNewsItems(processedNews);
      
      console.log(`✅ تمت معالجة ${finalNews.length} خبر بنجاح`);
      return finalNews;
      
    } catch (error) {
      console.error('خطأ في جلب ومعالجة الأخبار:', error);
      toast.error('فشل في تحديث الأخبار');
      return [];
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * إزالة الأخبار المكررة
   */
  private removeDuplicates(newsItems: NewsItem[]): NewsItem[] {
    const seen = new Set<string>();
    const unique: NewsItem[] = [];
    
    for (const item of newsItems) {
      // إنشاء مفتاح فريد بناءً على العنوان والمحتوى
      const key = this.createUniqueKey(item.title, item.content);
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    
    return unique;
  }

  /**
   * إنشاء مفتاح فريد للخبر
   */
  private createUniqueKey(title: string, content: string): string {
    const normalizedTitle = title.toLowerCase().replace(/[^\u0600-\u06FF\s]/g, '').trim();
    const normalizedContent = content.substring(0, 100).toLowerCase().replace(/[^\u0600-\u06FF\s]/g, '').trim();
    
    return `${normalizedTitle}-${normalizedContent}`;
  }

  /**
   * معالجة الأخبار بالذكاء الاصطناعي
   */
  private async processNewsWithAI(newsItems: NewsItem[]): Promise<NewsItem[]> {
    const processedNews: NewsItem[] = [];
    
    // معالجة الأخبار في مجموعات صغيرة لتجنب تجاوز حدود API
    const batchSize = 5;
    
    for (let i = 0; i < newsItems.length; i += batchSize) {
      const batch = newsItems.slice(i, i + batchSize);
      
      const processedBatch = await Promise.allSettled(
        batch.map(item => this.processNewsItem(item))
      );
      
      processedBatch.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          processedNews.push(result.value);
        } else {
          console.warn(`فشل في معالجة الخبر ${i + index + 1}:`, result.reason);
          // إضافة الخبر الأصلي مع تحسينات بسيطة
          processedNews.push(this.enhanceNewsItem(batch[index]));
        }
      });
      
      // توقف قصير بين المجموعات
      if (i + batchSize < newsItems.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return processedNews;
  }

  /**
   * معالجة خبر واحد بالذكاء الاصطناعي
   */
  private async processNewsItem(item: NewsItem): Promise<NewsItem> {
    try {
      // إعادة صياغة المحتوى
      const rewrittenContent = await this.geminiService.rewriteContent({
        originalText: item.content,
        category: item.category,
        source: item.source,
        tone: 'neutral'
      });
      
      // إنشاء عنوان محسن
      const enhancedTitle = await this.geminiService.generateTitle(rewrittenContent, item.category);
      
      // إنشاء مقتطف جديد
      const newExcerpt = this.createExcerpt(rewrittenContent);
      
      return {
        ...item,
        title: enhancedTitle || item.title,
        content: rewrittenContent,
        excerpt: newExcerpt,
        isTranslated: false,
        readingTime: this.calculateReadingTime(rewrittenContent),
        tags: this.generateTags(rewrittenContent, item.category)
      };
    } catch (error) {
      console.error('خطأ في معالجة الخبر بالذكاء الاصطناعي:', error);
      return this.enhanceNewsItem(item);
    }
  }

  /**
   * تحسين الخبر بدون ذكاء اصطناعي
   */
  private enhanceNewsItem(item: NewsItem): NewsItem {
    return {
      ...item,
      content: this.enhanceContent(item.content, item.category),
      excerpt: this.createExcerpt(item.content),
      readingTime: this.calculateReadingTime(item.content),
      tags: this.generateTags(item.content, item.category)
    };
  }

  /**
   * تحسين المحتوى بطريقة بسيطة
   */
  private enhanceContent(content: string, category: string): string {
    const intro = this.getCategoryIntro(category);
    const conclusion = this.getCategoryConclusion(category);
    
    return `${intro} ${content}\n\n${conclusion}`;
  }

  /**
   * الحصول على مقدمة حسب الفئة
   */
  private getCategoryIntro(category: string): string {
    const introMap: Record<string, string> = {
      'سياسة': 'في تطور سياسي مهم،',
      'اقتصاد': 'على الصعيد الاقتصادي،',
      'محافظات': 'في إطار أخبار المحافظات المصرية،',
      'ذكاء اصطناعي': 'في عالم التكنولوجيا والذكاء الاصطناعي،',
      'عسكرية': 'في التطورات الأمنية والعسكرية،',
      'العالم': 'في آخر التطورات العالمية،',
      'رياضة': 'في الأوساط الرياضية،'
    };
    
    return introMap[category] || 'في آخر الأخبار،';
  }

  /**
   * الحصول على خاتمة حسب الفئة
   */
  private getCategoryConclusion(category: string): string {
    return 'يواصل مصدر بلس متابعة آخر التطورات وسيوافيكم بالمستجدات فور ورودها.';
  }

  /**
   * إنشاء مقتطف
   */
  private createExcerpt(content: string, maxLength: number = 150): string {
    const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();
    
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
    const wordsPerMinute = 200; // متوسط القراءة بالعربية
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * إنشاء تاجات
   */
  private generateTags(content: string, category: string): string[] {
    const tags: string[] = [category];
    const lowerContent = content.toLowerCase();
    
    // إضافة تاجات حسب المحتوى
    if (lowerContent.includes('مصر')) tags.push('مصر');
    if (lowerContent.includes('القاهرة')) tags.push('القاهرة');
    if (lowerContent.includes('حكومة')) tags.push('حكومة');
    if (lowerContent.includes('رئيس')) tags.push('رئاسة');
    if (lowerContent.includes('وزير')) tags.push('وزارة');
    
    return [...new Set(tags)].slice(0, 5); // حد أقصى 5 تاجات
  }
}

export default EnhancedNewsService;
