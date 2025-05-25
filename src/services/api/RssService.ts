import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { NewsItem } from '../../types/NewsItem';
import { GeminiService } from './GeminiService';

// واجهة لتكوين خدمة RSS
export interface RssConfig {
  feeds: string[];
  fetchInterval: number; // بالدقائق
  maxItemsPerFeed: number;
}

/**
 * خدمة لجلب وتحليل تغذيات RSS
 */
export class RssService {
  private static instance: RssService | null = null;
  private config: RssConfig;
  private geminiService: GeminiService;

  private constructor() {
    // التكوين الافتراضي
    this.config = {
      feeds: [
        'https://feed.informer.com/digests/7HUZFNOFWB/feeder.rss',
        'https://feed.informer.com/digests/ITT2WR6G42/feeder.rss'
      ],
      fetchInterval: 60, // كل ساعة
      maxItemsPerFeed: 10
    };
    
    this.geminiService = GeminiService.getInstance();
  }

  /**
   * الحصول على نسخة واحدة من الخدمة (نمط Singleton)
   */
  public static getInstance(): RssService {
    if (!RssService.instance) {
      RssService.instance = new RssService();
    }
    return RssService.instance;
  }

  /**
   * تحديث تكوين الخدمة
   */
  public updateConfig(newConfig: Partial<RssConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * جلب الأخبار من جميع تغذيات RSS المكونة
   */
  public async fetchAllFeeds(): Promise<NewsItem[]> {
    try {
      console.log('🔄 جلب الأخبار من تغذيات RSS...');
      
      const allNewsItems: NewsItem[] = [];
      
      // جلب الأخبار من كل تغذية RSS
      for (const feedUrl of this.config.feeds) {
        try {
          const feedItems = await this.fetchFeed(feedUrl);
          allNewsItems.push(...feedItems);
        } catch (error) {
          console.error(`خطأ في جلب تغذية RSS من ${feedUrl}:`, error);
        }
      }
      
      console.log(`✅ تم جلب ${allNewsItems.length} خبر من تغذيات RSS`);
      return allNewsItems;
    } catch (error) {
      console.error('خطأ في جلب تغذيات RSS:', error);
      return [];
    }
  }

  /**
   * جلب وتحليل تغذية RSS واحدة
   */
  private async fetchFeed(feedUrl: string): Promise<NewsItem[]> {
    try {
      // جلب محتوى التغذية
      const response = await axios.get(feedUrl);
      
      // تحليل XML
      const result = await parseStringPromise(response.data, { explicitArray: false });
      
      // استخراج العناصر
      const channel = result.rss.channel;
      const items = Array.isArray(channel.item) ? channel.item : [channel.item];
      
      // تحويل العناصر إلى NewsItem[]
      const newsItems: NewsItem[] = [];
      
      for (let i = 0; i < Math.min(items.length, this.config.maxItemsPerFeed); i++) {
        const item = items[i];
        
        if (!item) continue;
        
        // استخراج النص والصورة
        const title = item.title || '';
        const content = item.description || '';
        const link = item.link || '';
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // استخراج الصورة من المحتوى إذا كانت موجودة
        const imageUrl = this.extractImageFromContent(content) || '';
        
        // إعادة صياغة المحتوى باستخدام Gemini
        const rewrittenContent = await this.geminiService.rewriteContent({
          originalText: content,
          source: channel.title || 'تغذية RSS',
          tone: 'engaging'
        });
        
        // تصنيف المحتوى
        const category = await this.geminiService.classifyContent(content);
        
        // إنشاء عنصر الخبر
        const newsItem: NewsItem = {
          id: `rss-${Date.now()}-${i}`,
          title: title,
          content: rewrittenContent || content,
          excerpt: this.createExcerpt(rewrittenContent || content),
          category: category,
          date: pubDate.toISOString().split('T')[0],
          source: channel.title || 'تغذية RSS',
          image: imageUrl,
          featured: i === 0, // جعل أول خبر مميز
          originalLink: link
        };
        
        newsItems.push(newsItem);
      }
      
      return newsItems;
    } catch (error) {
      console.error(`خطأ في جلب تغذية RSS من ${feedUrl}:`, error);
      return [];
    }
  }

  /**
   * استخراج رابط الصورة من محتوى HTML
   */
  private extractImageFromContent(content: string): string | null {
    try {
      // البحث عن وسم img
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const match = content.match(imgRegex);
      
      if (match && match[1]) {
        return match[1];
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في استخراج الصورة من المحتوى:', error);
      return null;
    }
  }

  /**
   * إنشاء مقتطف من المحتوى
   */
  private createExcerpt(content: string, maxLength: number = 150): string {
    // إزالة وسوم HTML
    const textContent = content.replace(/<[^>]+>/g, '');
    
    // اقتطاع النص
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    // البحث عن نهاية الجملة أو الكلمة القريبة من الحد الأقصى
    let truncated = textContent.substring(0, maxLength);
    
    // البحث عن آخر نقطة أو فاصلة أو مسافة
    const lastPeriod = truncated.lastIndexOf('.');
    const lastComma = truncated.lastIndexOf('،');
    const lastSpace = truncated.lastIndexOf(' ');
    
    let endPos = Math.max(lastPeriod, lastComma, lastSpace);
    
    if (endPos > maxLength * 0.7) { // على الأقل 70% من الطول الأقصى
      truncated = truncated.substring(0, endPos + 1);
    } else {
      // إضافة "..." في نهاية المقتطف
      truncated += '...';
    }
    
    return truncated;
  }
}

export default RssService;
