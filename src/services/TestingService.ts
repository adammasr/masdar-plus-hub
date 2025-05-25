import { NewsItem } from '../types/NewsItem';

/**
 * خدمة اختبار لتحقق من صحة عمل نظام الأتمتة
 * تستخدم للتأكد من أن جميع مكونات النظام تعمل بشكل صحيح
 */
export class TestingService {
  /**
   * اختبار جلب الأخبار من المصادر
   */
  public static async testNewsFetching(): Promise<boolean> {
    try {
      // الحصول على الأخبار المخزنة
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      // التحقق من وجود أخبار
      if (articles.length === 0) {
        console.error('❌ اختبار جلب الأخبار: لا توجد أخبار مخزنة');
        return false;
      }
      
      console.log(`✅ اختبار جلب الأخبار: تم العثور على ${articles.length} خبر`);
      
      // التحقق من وجود أخبار من مصادر مختلفة
      const sources = new Set(articles.map((article: NewsItem) => article.source));
      console.log(`📊 مصادر الأخبار: ${Array.from(sources).join(', ')}`);
      
      // التحقق من وجود أخبار في فئات مختلفة
      const categories = new Set(articles.map((article: NewsItem) => article.category));
      console.log(`📊 فئات الأخبار: ${Array.from(categories).join(', ')}`);
      
      return true;
    } catch (error) {
      console.error('❌ اختبار جلب الأخبار فشل:', error);
      return false;
    }
  }
  
  /**
   * اختبار إعادة صياغة المحتوى
   */
  public static testContentRewriting(): boolean {
    try {
      // الحصول على الأخبار المخزنة
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      if (articles.length === 0) {
        console.error('❌ اختبار إعادة الصياغة: لا توجد أخبار مخزنة');
        return false;
      }
      
      // التحقق من جودة المحتوى المعاد صياغته
      let validContentCount = 0;
      
      for (const article of articles) {
        // التحقق من طول المحتوى
        if (article.content && article.content.length > 100) {
          validContentCount++;
        }
      }
      
      const validPercentage = (validContentCount / articles.length) * 100;
      console.log(`📊 نسبة الأخبار ذات المحتوى الجيد: ${validPercentage.toFixed(2)}%`);
      
      return validPercentage >= 80; // على الأقل 80% من الأخبار يجب أن تكون ذات محتوى جيد
    } catch (error) {
      console.error('❌ اختبار إعادة الصياغة فشل:', error);
      return false;
    }
  }
  
  /**
   * اختبار الصور
   */
  public static testImages(): boolean {
    try {
      // الحصول على الأخبار المخزنة
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      if (articles.length === 0) {
        console.error('❌ اختبار الصور: لا توجد أخبار مخزنة');
        return false;
      }
      
      // التحقق من وجود صور صالحة
      let validImageCount = 0;
      
      for (const article of articles) {
        // التحقق من وجود رابط صورة صالح
        if (article.image && article.image.startsWith('http')) {
          validImageCount++;
        }
      }
      
      const validPercentage = (validImageCount / articles.length) * 100;
      console.log(`📊 نسبة الأخبار ذات الصور الصالحة: ${validPercentage.toFixed(2)}%`);
      
      return validPercentage >= 80; // على الأقل 80% من الأخبار يجب أن تكون ذات صور صالحة
    } catch (error) {
      console.error('❌ اختبار الصور فشل:', error);
      return false;
    }
  }
  
  /**
   * اختبار التصنيف
   */
  public static testCategorization(): boolean {
    try {
      // الحصول على الأخبار المخزنة
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      if (articles.length === 0) {
        console.error('❌ اختبار التصنيف: لا توجد أخبار مخزنة');
        return false;
      }
      
      // التحقق من تنوع التصنيفات
      const categories = new Set(articles.map((article: NewsItem) => article.category));
      
      console.log(`📊 عدد الفئات المختلفة: ${categories.size}`);
      console.log(`📊 الفئات: ${Array.from(categories).join(', ')}`);
      
      // يجب أن يكون هناك على الأقل 3 فئات مختلفة
      return categories.size >= 3;
    } catch (error) {
      console.error('❌ اختبار التصنيف فشل:', error);
      return false;
    }
  }
  
  /**
   * تنفيذ جميع الاختبارات
   */
  public static async runAllTests(): Promise<{
    success: boolean;
    results: {
      fetching: boolean;
      rewriting: boolean;
      images: boolean;
      categorization: boolean;
    }
  }> {
    console.log('🧪 بدء اختبارات النظام...');
    
    const fetchingResult = await this.testNewsFetching();
    const rewritingResult = this.testContentRewriting();
    const imagesResult = this.testImages();
    const categorizationResult = this.testCategorization();
    
    const overallSuccess = fetchingResult && rewritingResult && imagesResult && categorizationResult;
    
    console.log(`${overallSuccess ? '✅' : '❌'} نتيجة الاختبارات: ${overallSuccess ? 'ناجحة' : 'فاشلة'}`);
    
    return {
      success: overallSuccess,
      results: {
        fetching: fetchingResult,
        rewriting: rewritingResult,
        images: imagesResult,
        categorization: categorizationResult
      }
    };
  }
}

export default TestingService;
