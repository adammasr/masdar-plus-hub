
import axios from 'axios';
import { NewsItem } from '../../types/NewsItem';

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: any[];
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: any[];
}

/**
 * خدمة جلب الأخبار من NewsAPI و NewsData.io
 */
export class NewsApiService {
  private static instance: NewsApiService | null = null;
  
  // مفاتيح API
  private readonly newsApiKey = '3b081dbd20914fa593eadcce3b88dac3';
  private readonly newsDataApiKey = 'pub_ae32bb142b1249c5975f2dcfe75a4ed9';
  
  // URLs لـ NewsData.io المخصصة
  private readonly newsDataUrls = [
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A7%D9%84%D9%85%D9%86%D9%88%D9%81%D9%8A%D8%A9',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A7%D9%84%D8%AD%D9%83%D9%88%D9%85%D8%A9%20%D9%88%D8%A7%D9%84%D9%88%D8%B2%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A%D8%A9',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B9%D8%B3%D9%83%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1%20%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D9%85%D8%B5%D8%B1&timezone=Africa/Cairo',
    'https://newsdata.io/api/1/latest?apikey=pub_ae32bb142b1249c5975f2dcfe75a4ed9&q=%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1%20%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A&timezone=Africa/Cairo'
  ];

  private constructor() {}

  public static getInstance(): NewsApiService {
    if (!NewsApiService.instance) {
      NewsApiService.instance = new NewsApiService();
    }
    return NewsApiService.instance;
  }

  /**
   * جلب الأخبار من جميع المصادر
   */
  public async fetchAllNews(): Promise<NewsItem[]> {
    try {
      console.log('🔄 جلب الأخبار من NewsAPI و NewsData.io...');
      
      const allNews: NewsItem[] = [];
      
      // جلب من NewsAPI
      const newsApiItems = await this.fetchFromNewsAPI();
      allNews.push(...newsApiItems);
      
      // جلب من NewsData.io
      const newsDataItems = await this.fetchFromNewsData();
      allNews.push(...newsDataItems);
      
      console.log(`✅ تم جلب ${allNews.length} خبر من مصادر الأخبار`);
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
    try {
      const keywords = ['مصر', 'القاهرة', 'الحكومة المصرية', 'المنوفية', 'الإسكندرية', 'محافظات'];
      const sources = 'al-ahram-eg,youm7,masrawy';
      
      const response = await axios.get<NewsApiResponse>('https://newsapi.org/v2/everything', {
        params: {
          apiKey: this.newsApiKey,
          q: keywords.join(' OR '),
          sources: sources,
          language: 'ar',
          sortBy: 'publishedAt',
          pageSize: 20
        },
        timeout: 10000
      });

      if (response.data.status !== 'ok') {
        throw new Error('فشل في جلب الأخبار من NewsAPI');
      }

      return response.data.articles.map((article, index) => this.convertNewsApiToNewsItem(article, index));
    } catch (error) {
      console.error('خطأ في جلب أخبار NewsAPI:', error);
      return [];
    }
  }

  /**
   * جلب الأخبار من NewsData.io
   */
  private async fetchFromNewsData(): Promise<NewsItem[]> {
    try {
      const allNews: NewsItem[] = [];
      
      for (const url of this.newsDataUrls) {
        try {
          const response = await axios.get<NewsDataResponse>(url, {
            timeout: 10000
          });
          
          if (response.data.status === 'success' && response.data.results) {
            const convertedNews = response.data.results.map((article, index) => 
              this.convertNewsDataToNewsItem(article, index, url)
            );
            allNews.push(...convertedNews);
          }
        } catch (error) {
          console.warn(`تخطي URL: ${url}`, error.message);
        }
      }
      
      return allNews;
    } catch (error) {
      console.error('خطأ في جلب أخبار NewsData.io:', error);
      return [];
    }
  }

  /**
   * تحويل مقال NewsAPI إلى NewsItem
   */
  private convertNewsApiToNewsItem(article: any, index: number): NewsItem {
    const category = this.categorizeContent(article.title + ' ' + (article.description || ''));
    
    return {
      id: `newsapi-${Date.now()}-${index}`,
      title: this.cleanText(article.title || 'بدون عنوان'),
      content: this.cleanText(article.content || article.description || ''),
      excerpt: this.createExcerpt(article.description || article.content || ''),
      category: category,
      date: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'NewsAPI',
      image: article.urlToImage || this.getDefaultImage(category),
      featured: index === 0 && Math.random() > 0.7,
      originalLink: article.url,
      isTranslated: false
    };
  }

  /**
   * تحويل مقال NewsData.io إلى NewsItem
   */
  private convertNewsDataToNewsItem(article: any, index: number, sourceUrl: string): NewsItem {
    const category = this.categorizeFromUrl(sourceUrl) || this.categorizeContent(article.title + ' ' + (article.description || ''));
    
    return {
      id: `newsdata-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      title: this.cleanText(article.title || 'بدون عنوان'),
      content: this.cleanText(article.content || article.description || ''),
      excerpt: this.createExcerpt(article.description || article.content || ''),
      category: category,
      date: article.pubDate || new Date().toISOString(),
      source: article.source_id || 'NewsData',
      image: article.image_url || this.getDefaultImage(category),
      featured: index === 0 && Math.random() > 0.6,
      originalLink: article.link,
      isTranslated: false
    };
  }

  /**
   * تصنيف المحتوى حسب URL المصدر
   */
  private categorizeFromUrl(url: string): string | null {
    if (url.includes('%D8%A7%D9%84%D9%85%D9%86%D9%88%D9%81%D9%8A%D8%A9')) return 'محافظات';
    if (url.includes('%D8%A7%D9%84%D8%AD%D9%83%D9%88%D9%85%D8%A9')) return 'سياسة';
    if (url.includes('%D8%A7%D9%84%D8%B9%D8%B3%D9%83%D8%B1%D9%8A%D8%A9')) return 'عسكرية';
    if (url.includes('%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1%20%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A')) return 'ذكاء اصطناعي';
    if (url.includes('%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9')) return 'رياضة';
    if (url.includes('%D8%A7%D9%84%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF')) return 'اقتصاد';
    if (url.includes('%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D9%85%D8%B5%D8%B1')) return 'أخبار';
    return null;
  }

  /**
   * تصنيف المحتوى تلقائياً
   */
  private categorizeContent(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ذكاء اصطناعي') || lowerText.includes('ai') || lowerText.includes('تكنولوجيا')) {
      return 'ذكاء اصطناعي';
    }
    if (lowerText.includes('سياس') || lowerText.includes('حكوم') || lowerText.includes('رئيس') || lowerText.includes('وزير')) {
      return 'سياسة';
    }
    if (lowerText.includes('اقتصاد') || lowerText.includes('مال') || lowerText.includes('بنك') || lowerText.includes('استثمار')) {
      return 'اقتصاد';
    }
    if (lowerText.includes('عسكري') || lowerText.includes('جيش') || lowerText.includes('دفاع') || lowerText.includes('أمن')) {
      return 'عسكرية';
    }
    if (lowerText.includes('محافظ') || lowerText.includes('منوفية') || lowerText.includes('إسكندرية') || lowerText.includes('محافظة')) {
      return 'محافظات';
    }
    if (lowerText.includes('رياض') || lowerText.includes('كرة') || lowerText.includes('مباراة') || lowerText.includes('فريق')) {
      return 'رياضة';
    }
    if (lowerText.includes('دولي') || lowerText.includes('عالم') || lowerText.includes('أمريكا') || lowerText.includes('أوروبا')) {
      return 'العالم';
    }
    
    return 'أخبار';
  }

  /**
   * تنظيف النص
   */
  private cleanText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * إنشاء مقتطف
   */
  private createExcerpt(text: string, maxLength: number = 150): string {
    const cleanText = this.cleanText(text);
    if (cleanText.length <= maxLength) return cleanText;
    
    let truncated = cleanText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.7) {
      truncated = truncated.substring(0, lastSpace);
    }
    
    return truncated + '...';
  }

  /**
   * الحصول على صورة افتراضية حسب الفئة
   */
  private getDefaultImage(category: string): string {
    const imageMap: Record<string, string> = {
      'سياسة': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=60',
      'اقتصاد': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
      'محافظات': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&auto=format&fit=crop&q=60',
      'ذكاء اصطناعي': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
      'عسكرية': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=60',
      'العالم': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
      'رياضة': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60'
    };
    
    return imageMap[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60';
  }
}

export default NewsApiService;
