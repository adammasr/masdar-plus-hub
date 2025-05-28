import { NewsItem } from '../types/NewsItem';
import { EnhancedNewsService } from './api/EnhancedNewsService';
import { toast } from 'sonner';

// واجهة لتكوين خدمة المزامنة
export interface SyncConfig {
  enabled: boolean;
  interval: number; // بالدقائق
  maxArticles: number; // الحد الأقصى للمقالات المحفوظة
  sources: {
    newsApi: boolean;
    rss: boolean;
  };
}

/**
 * خدمة المزامنة التلقائية المحسنة
 * تستخدم جميع مصادر الأخبار مع الذكاء الاصطناعي للمعالجة
 */
export class EnhancedAutoSyncService {
  private static instance: EnhancedAutoSyncService | null = null;
  private config: SyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isFirstRun: boolean = true;
  private isSyncing: boolean = false;
  
  // الخدمات المستخدمة
  private enhancedNewsService: EnhancedNewsService;

  private constructor() {
    // تهيئة خدمة الأخبار المحسنة
    this.enhancedNewsService = EnhancedNewsService.getInstance();
    
    // تحميل التكوين من التخزين المحلي أو استخدام الافتراضي
    const savedConfig = localStorage.getItem('autoSyncConfig');
    
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (e) {
        this.config = this.getDefaultConfig();
      }
    } else {
      this.config = this.getDefaultConfig();
    }
    
    // بدء المزامنة التلقائية
    this.startAutoSync();
  }

  /**
   * الحصول على نسخة واحدة من الخدمة (نمط Singleton)
   */
  public static getInstance(): EnhancedAutoSyncService {
    if (!EnhancedAutoSyncService.instance) {
      EnhancedAutoSyncService.instance = new EnhancedAutoSyncService();
    }
    return EnhancedAutoSyncService.instance;
  }

  /**
   * الحصول على التكوين الافتراضي
   */
  private getDefaultConfig(): SyncConfig {
    return {
      enabled: true,
      interval: 60, // كل ساعة
      maxArticles: 1000, // حد أقصى 1000 مقال
      sources: {
        newsApi: true,
        rss: true
      }
    };
  }

  /**
   * حفظ التكوين في التخزين المحلي
   */
  private saveConfig(): void {
    localStorage.setItem('autoSyncConfig', JSON.stringify(this.config));
  }

  /**
   * تحديث تكوين المزامنة
   */
  public updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.restartAutoSync();
  }

  /**
   * المزامنة الرئيسية - جلب ومعالجة الأخبار
   */
  private async syncFromSources(): Promise<void> {
    if (this.isSyncing) {
      console.log('⏳ المزامنة قيد التنفيذ بالفعل...');
      return;
    }

    this.isSyncing = true;
    
    try {
      console.log('🔄 بدء المزامنة التلقائية المحسنة...');
      
      // جلب ومعالجة الأخبار من جميع المصادر
      const processedNews = await this.enhancedNewsService.fetchAndProcessAllNews();
      
      // إضافة الأخبار الجديدة
      let newArticlesCount = 0;
      if (processedNews.length > 0) {
        newArticlesCount = this.addNewArticles(processedNews);
      }
      
      // تنظيف المقالات القديمة
      this.cleanOldArticles();
      
      // إرسال حدث للإشعار بالتحديث
      window.dispatchEvent(new CustomEvent('articlesUpdated', {
        detail: { newCount: newArticlesCount }
      }));
      
      // عرض إشعار للمستخدم
      if (newArticlesCount > 0) {
        toast.success(`✅ تم إضافة ${newArticlesCount} خبر جديد محسن بالذكاء الاصطناعي`, {
          description: `آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')}`,
          duration: 6000
        });
        console.log(`✅ تم إضافة ${newArticlesCount} خبر جديد إلى الموقع`);
      } else if (!this.isFirstRun) {
        toast.info('🔍 تم فحص المصادر - لا توجد أخبار جديدة', {
          description: `آخر فحص: ${new Date().toLocaleTimeString('ar-EG')}`,
          duration: 3000
        });
      }
      
      // حفظ آخر وقت مزامنة
      localStorage.setItem('lastAutoSync', new Date().toISOString());
      
      this.isFirstRun = false;
    } catch (error) {
      console.error('خطأ في المزامنة التلقائية:', error);
      toast.error('فشل في تحديث الأخبار تلقائياً');
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * إضافة الأخبار الجديدة إلى التخزين المحلي
   */
  private addNewArticles(newArticles: NewsItem[]): number {
    const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // تصفية الأخبار المكررة بناءً على التشابه المتقدم
    const uniqueNewArticles = newArticles.filter(newArticle => 
      !existingArticles.some((existing: any) => 
        this.isSimilarArticle(existing, newArticle)
      )
    );
    
    if (uniqueNewArticles.length > 0) {
      // ترتيب الأخبار حسب التاريخ (الأحدث أولاً)
      const sortedNewArticles = uniqueNewArticles.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // دمج الأخبار الجديدة مع الموجودة
      const updatedArticles = [...sortedNewArticles, ...existingArticles];
      
      // تطبيق الحد الأقصى للمقالات
      const limitedArticles = updatedArticles.slice(0, this.config.maxArticles);
      
      // حفظ الأخبار المحدثة
      localStorage.setItem('articles', JSON.stringify(limitedArticles));
      
      console.log(`✅ تم إضافة ${uniqueNewArticles.length} مقال جديد`);
    }
    
    return uniqueNewArticles.length;
  }

  /**
   * التحقق من تشابه المقالات المتقدم
   */
  private isSimilarArticle(existing: any, newArticle: NewsItem): boolean {
    // مقارنة العناوين
    const titleSimilarity = this.calculateSimilarity(existing.title, newArticle.title);
    if (titleSimilarity > 0.8) return true;
    
    // مقارنة الروابط الأصلية إذا وجدت
    if (existing.originalLink && newArticle.originalLink) {
      return existing.originalLink === newArticle.originalLink;
    }
    
    // مقارنة المحتوى للمقالات القصيرة
    if (existing.content && newArticle.content) {
      const contentSimilarity = this.calculateSimilarity(
        existing.content.substring(0, 200), 
        newArticle.content.substring(0, 200)
      );
      if (contentSimilarity > 0.85) return true;
    }
    
    // مقارنة المصدر والتاريخ
    if (existing.source === newArticle.source) {
      const existingDate = new Date(existing.date).getTime();
      const newDate = new Date(newArticle.date).getTime();
      const timeDiff = Math.abs(existingDate - newDate);
      
      // إذا كانا من نفس المصدر وفي نفس اليوم تقريباً
      if (timeDiff < 24 * 60 * 60 * 1000) { // أقل من 24 ساعة
        return titleSimilarity > 0.6;
      }
    }
    
    return false;
  }

  /**
   * حساب درجة التشابه بين نصين (محسن)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    const normalize = (str: string) => str
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\s]/g, '') // الاحتفاظ بالعربية والمسافات فقط
      .replace(/\s+/g, ' ')
      .trim();
    
    const norm1 = normalize(text1);
    const norm2 = normalize(text2);
    
    if (norm1 === norm2) return 1;
    
    // حساب التشابه بناءً على الكلمات المشتركة
    const words1 = norm1.split(/\s+/).filter(word => word.length > 2);
    const words2 = norm2.split(/\s+/).filter(word => word.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return commonWords.length / totalWords;
  }

  /**
   * تنظيف المقالات القديمة
   */
  private cleanOldArticles(): void {
    try {
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      if (articles.length > this.config.maxArticles) {
        // ترتيب حسب التاريخ والاحتفاظ بالأحدث
        const sortedArticles = articles.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const cleanedArticles = sortedArticles.slice(0, this.config.maxArticles);
        localStorage.setItem('articles', JSON.stringify(cleanedArticles));
        
        const removedCount = articles.length - cleanedArticles.length;
        console.log(`🧹 تم حذف ${removedCount} مقال قديم`);
      }
    } catch (error) {
      console.error('خطأ في تنظيف المقالات القديمة:', error);
    }
  }

  /**
   * بدء المزامنة التلقائية
   */
  private startAutoSync(): void {
    if (!this.config.enabled) return;
    
    // تنفيذ أول مزامنة بعد 10 ثوان من بدء التطبيق
    setTimeout(() => this.syncFromSources(), 10000);
    
    // إعداد المزامنة الدورية
    this.syncInterval = setInterval(() => {
      this.syncFromSources();
    }, this.config.interval * 60 * 1000);
    
    console.log(`⏰ تم تفعيل المزامنة التلقائية كل ${this.config.interval} دقيقة`);
  }

  /**
   * إيقاف المزامنة التلقائية
   */
  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️ تم إيقاف المزامنة التلقائية');
    }
  }

  /**
   * إعادة تشغيل المزامنة التلقائية
   */
  private restartAutoSync(): void {
    this.stopAutoSync();
    this.startAutoSync();
  }

  /**
   * الحصول على تكوين المزامنة الحالي
   */
  public getConfig(): SyncConfig {
    return { ...this.config };
  }

  /**
   * تنفيذ مزامنة يدوية
   */
  public manualSync(): void {
    if (this.isSyncing) {
      toast.info('المزامنة قيد التنفيذ بالفعل...');
      return;
    }
    
    toast.info('بدء المزامنة اليدوية المحسنة...');
    this.syncFromSources();
  }

  /**
   * الحصول على حالة المزامنة
   */
  public getSyncStatus(): { isEnabled: boolean; isSyncing: boolean; nextSync: string; lastSync: string } {
    const lastSync = localStorage.getItem('lastAutoSync');
    const lastSyncFormatted = lastSync ? 
      new Date(lastSync).toLocaleString('ar-EG') : 
      'لم يتم بعد';
    
    const nextSyncTime = this.syncInterval ? 
      new Date(Date.now() + this.config.interval * 60 * 1000).toLocaleTimeString('ar-EG') : 
      'غير محدد';
    
    return {
      isEnabled: this.config.enabled,
      isSyncing: this.isSyncing,
      nextSync: nextSyncTime,
      lastSync: lastSyncFormatted
    };
  }

  /**
   * تنظيف الموارد عند إغلاق التطبيق
   */
  public destroy(): void {
    this.stopAutoSync();
    EnhancedAutoSyncService.instance = null;
  }

  /**
   * Clears all stored articles from localStorage and resets relevant service state.
   */
  public clearAllArticles(): void {
    try {
      localStorage.removeItem('articles');
      localStorage.removeItem('lastAutoSync'); // Also clear the last sync time
      
      this.isFirstRun = true; // Reset to behave like an initial run on next sync
      
      // Optionally, immediately clear articles in any listening UI components.
      // This can be done by dispatching an event that ArticleContext or UI listens to.
      // For example, signaling that the articles list is now empty.
      window.dispatchEvent(new CustomEvent('articlesUpdated', {
        detail: { newCount: 0, cleared: true } // Signal that articles were cleared
      }));

      console.log("All stored articles and last sync time have been cleared from localStorage. EnhancedAutoSyncService state reset.");
      toast.success("تم حذف جميع المقالات المخزنة بنجاح!");

    } catch (error) {
      console.error("Error clearing articles from localStorage:", error);
      toast.error("فشل في حذف المقالات المخزنة.");
    }
  }
}

export default EnhancedAutoSyncService;
