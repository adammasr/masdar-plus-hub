
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { NewsItem } from '../../types/NewsItem';
import { GeminiService } from './GeminiService';
import ImageService from './ImageService';

// واجهة لتكوين خدمة RSS
export interface RssConfig {
  feeds: string[];
  fetchInterval: number; // بالدقائق
  maxItemsPerFeed: number;
}

/**
 * خدمة لجلب وتحليل تغذيات RSS محسنة للمحتوى العربي
 */
export class RssService {
  private static instance: RssService | null = null;
  private config: RssConfig;
  private geminiService: GeminiService;
  private imageService: ImageService;

  private constructor() {
    // تغذيات RSS محسنة للمحتوى العربي
    this.config = {
      feeds: [
        'https://www.aljazeera.net/aje/articles/rss.xml',
        'https://arabic.cnn.com/api/v1/rss/rss.xml',
        'https://www.bbc.com/arabic/rss.xml',
        'https://www.alarabiya.net/ar/rss.xml',
        'https://www.skynewsarabia.com/rss',
        'https://www.albawabhnews.com/rss.xml',
        'https://www.youm7.com/rss',
        'https://www.masrawy.com/rss/rssfeeds',
        'https://feed.informer.com/digests/7HUZFNOFWB/feeder.rss',
        'https://feed.informer.com/digests/ITT2WR6G42/feeder.rss'
      ],
      fetchInterval: 30, // كل نصف ساعة
      maxItemsPerFeed: 8
    };
    
    this.geminiService = GeminiService.getInstance();
    this.imageService = ImageService.getInstance();
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
      const fetchPromises = this.config.feeds.map(feedUrl => 
        this.fetchFeed(feedUrl).catch(error => {
          console.warn(`تخطي تغذية RSS من ${feedUrl}:`, error.message);
          return [];
        })
      );
      
      const results = await Promise.allSettled(fetchPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allNewsItems.push(...result.value);
        } else {
          console.warn(`فشل في جلب تغذية RSS من ${this.config.feeds[index]}`);
        }
      });
      
      // معالجة الصور
      const processedItems = await this.imageService.processNewsItems(allNewsItems);
      
      console.log(`✅ تم جلب ${processedItems.length} خبر من تغذيات RSS`);
      return processedItems;
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
      // استخدام proxy لتجنب مشاكل CORS
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      
      const response = await axios.get(proxyUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
        }
      });
      
      if (response.data.status !== 'ok') {
        throw new Error(`خطأ في تحليل RSS: ${response.data.message}`);
      }
      
      const items = response.data.items || [];
      const newsItems: NewsItem[] = [];
      
      for (let i = 0; i < Math.min(items.length, this.config.maxItemsPerFeed); i++) {
        const item = items[i];
        
        if (!item || !item.title) continue;
        
        // تنظيف العنوان والمحتوى
        const title = this.cleanArabicText(item.title);
        const content = this.cleanArabicText(item.description || item.content || '');
        const link = item.link || '';
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // استخراج الصورة
        let imageUrl = item.enclosure?.link || item.thumbnail || '';
        if (!imageUrl && content) {
          imageUrl = this.extractImageFromContent(content) || '';
        }
        
        // تصنيف المحتوى تلقائياً
        const category = this.classifyContent(title, content);
        
        // إنشاء عنصر الخبر
        const newsItem: NewsItem = {
          id: `rss-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          title: title,
          content: content,
          excerpt: this.createExcerpt(content),
          category: category,
          date: pubDate.toISOString(),
          source: response.data.feed?.title || 'RSS Feed',
          image: imageUrl,
          featured: i === 0 && Math.random() > 0.7, // جعل بعض الأخبار مميزة عشوائياً
          originalLink: link
        };
        
        newsItems.push(newsItem);
      }
      
      return newsItems;
    } catch (error) {
      console.error(`خطأ في جلب تغذية RSS من ${feedUrl}:`, error);
      throw error;
    }
  }

  /**
   * تنظيف النص العربي
   */
  private cleanArabicText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/<[^>]+>/g, '') // إزالة وسوم HTML
      .replace(/&nbsp;/g, ' ') // إزالة المسافات غير الضرورية
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/\s+/g, ' ') // توحيد المسافات
      .trim();
  }

  /**
   * تصنيف المحتوى تلقائياً
   */
  private classifyContent(title: string, content: string): string {
    const fullText = (title + ' ' + content).toLowerCase();
    
    if (fullText.includes('سياس') || fullText.includes('حكوم') || fullText.includes('رئيس') || fullText.includes('وزير')) {
      return 'سياسة';
    }
    if (fullText.includes('اقتصاد') || fullText.includes('مال') || fullText.includes('بنك') || fullText.includes('استثمار')) {
      return 'اقتصاد';
    }
    if (fullText.includes('ذكاء اصطناعي') || fullText.includes('تكنولوجيا') || fullText.includes('تقني')) {
      return 'ذكاء اصطناعي';
    }
    if (fullText.includes('عسكري') || fullText.includes('جيش') || fullText.includes('دفاع') || fullText.includes('أمن')) {
      return 'عسكرية';
    }
    if (fullText.includes('محافظ') || fullText.includes('قاهرة') || fullText.includes('إسكندرية') || fullText.includes('الجيزة')) {
      return 'محافظات';
    }
    if (fullText.includes('دولي') || fullText.includes('عالم') || fullText.includes('أمريكا') || fullText.includes('أوروبا')) {
      return 'العالم';
    }
    
    return 'أخبار';
  }

  /**
   * استخراج رابط الصورة من محتوى HTML
   */
  private extractImageFromContent(content: string): string | null {
    try {
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
    const textContent = this.cleanArabicText(content);
    
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    let truncated = textContent.substring(0, maxLength);
    
    const lastPeriod = truncated.lastIndexOf('.');
    const lastComma = truncated.lastIndexOf('،');
    const lastSpace = truncated.lastIndexOf(' ');
    
    let endPos = Math.max(lastPeriod, lastComma, lastSpace);
    
    if (endPos > maxLength * 0.7) {
      truncated = truncated.substring(0, endPos + 1);
    } else {
      truncated += '...';
    }
    
    return truncated;
  }
}

export default RssService;
