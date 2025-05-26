import { NewsItem } from '../../types/NewsItem';
import { GeminiService } from './GeminiService';
import { RssService } from './RssService';
import { FacebookService } from './FacebookService';
import { ImageService } from './ImageService';

/**
 * خدمة اختبار النظام
 * تستخدم لاختبار جميع وظائف النظام والتأكد من عملها بشكل صحيح
 */
export class TestingService {
  /**
   * تنفيذ جميع اختبارات النظام
   */
  public static async runAllTests() {
    try {
      console.log('🧪 بدء تنفيذ اختبارات النظام...');
      
      // تهيئة الخدمات
      const rssService = RssService.getInstance();
      const facebookService = FacebookService.getInstance();
      const geminiService = GeminiService.getInstance();
      const imageService = ImageService.getInstance();
      
      // نتائج الاختبارات
      const results = {
        fetching: false,
        rewriting: false,
        images: false,
        categorization: false
      };
      
      // اختبار جلب الأخبار
      const rssItems = await this.testFetching(rssService, facebookService);
      results.fetching = rssItems.length > 0;
      
      // اختبار إعادة الصياغة
      if (results.fetching) {
        results.rewriting = await this.testRewriting(geminiService, rssItems[0]);
      }
      
      // اختبار الصور
      if (results.fetching) {
        results.images = await this.testImages(imageService, rssItems);
      }
      
      // اختبار التصنيف
      if (results.fetching) {
        results.categorization = this.testCategorization(rssItems);
      }
      
      // النتيجة النهائية
      const success = Object.values(results).every(result => result === true);
      
      return {
        success,
        results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('خطأ في تنفيذ اختبارات النظام:', error);
      return {
        success: false,
        results: {
          fetching: false,
          rewriting: false,
          images: false,
          categorization: false
        },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * اختبار جلب الأخبار
   */
  private static async testFetching(rssService: RssService, facebookService: FacebookService) {
    try {
      // جلب عينة من الأخبار من RSS
      const rssItems = await rssService.fetchAllFeeds();
      
      // جلب عينة من المنشورات من فيسبوك
      const facebookItems = await facebookService.fetchAllPages();
      
      // دمج النتائج
      const allItems = [...rssItems, ...facebookItems];
      
      console.log(`✅ اختبار جلب الأخبار: تم جلب ${allItems.length} خبر`);
      return allItems;
    } catch (error) {
      console.error('خطأ في اختبار جلب الأخبار:', error);
      return [];
    }
  }
  
  /**
   * اختبار إعادة الصياغة
   */
  private static async testRewriting(geminiService: GeminiService, newsItem: NewsItem) {
    try {
      if (!newsItem || !newsItem.content) {
        return false;
      }
      
      // إعادة صياغة محتوى الخبر
      const originalContent = newsItem.content.substring(0, 200); // أخذ جزء من المحتوى للاختبار
      const rewrittenContent = await geminiService.rewriteContent({
        originalText: originalContent,
        category: newsItem.category,
        source: newsItem.source,
        tone: 'neutral'
      });
      
      // التحقق من جودة إعادة الصياغة
      const isValid = rewrittenContent && 
                     rewrittenContent.length > 50 && 
                     rewrittenContent !== originalContent;
      
      console.log(`${isValid ? '✅' : '❌'} اختبار إعادة الصياغة`);
      return isValid;
    } catch (error) {
      console.error('خطأ في اختبار إعادة الصياغة:', error);
      return false;
    }
  }
  
  /**
   * اختبار الصور
   */
  private static async testImages(imageService: ImageService, newsItems: NewsItem[]) {
    try {
      if (!newsItems || newsItems.length === 0) {
        return false;
      }
      
      // معالجة الصور لعينة من الأخبار
      const processedItems = await imageService.processNewsItems(newsItems.slice(0, 3));
      
      // التحقق من وجود صور صالحة
      const allHaveValidImages = processedItems.every(item => 
        item.image && item.image.startsWith('http')
      );
      
      console.log(`${allHaveValidImages ? '✅' : '❌'} اختبار الصور`);
      return allHaveValidImages;
    } catch (error) {
      console.error('خطأ في اختبار الصور:', error);
      return false;
    }
  }
  
  /**
   * اختبار التصنيف
   */
  private static testCategorization(newsItems: NewsItem[]) {
    try {
      if (!newsItems || newsItems.length < 5) {
        return false;
      }
      
      // استخراج جميع الفئات
      const categories = newsItems.map(item => item.category);
      
      // التحقق من تنوع الفئات
      const uniqueCategories = new Set(categories);
      const isValid = uniqueCategories.size >= 2; // على الأقل فئتان مختلفتان
      
      console.log(`${isValid ? '✅' : '❌'} اختبار التصنيف: ${uniqueCategories.size} فئة مختلفة`);
      return isValid;
    } catch (error) {
      console.error('خطأ في اختبار التصنيف:', error);
      return false;
    }
  }
}

export default TestingService;
