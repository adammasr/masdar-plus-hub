
import { NewsItem } from '../types/NewsItem';
import { GeminiService } from './api/GeminiService';
import { RssService } from './api/RssService';
import { FacebookService } from './api/FacebookService';
import { toast } from 'sonner';

// واجهة لتكوين خدمة المزامنة
export interface SyncConfig {
  enabled: boolean;
  interval: number; // بالدقائق
  sources: {
    rss: boolean;
    facebook: boolean;
  };
}

/**
 * خدمة المزامنة التلقائية المحسنة
 * تجمع بين مصادر RSS وفيسبوك مع إعادة الصياغة والتصنيف التلقائي
 */
export class EnhancedAutoSyncService {
  private static instance: EnhancedAutoSyncService | null = null;
  private config: SyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isFirstRun: boolean = true;
  private isSyncing: boolean = false;
  
  // الخدمات المستخدمة
  private rssService: RssService;
  private facebookService: FacebookService;
  private geminiService: GeminiService;

  private constructor() {
    // تهيئة الخدمات
    this.rssService = RssService.getInstance();
    this.facebookService = FacebookService.getInstance();
    this.geminiService = GeminiService.getInstance();
    
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
      interval: 30, // كل نصف ساعة
      sources: {
        rss: true,
        facebook: false // تعطيل فيسبوك مؤقتاً لحين إعداد الـ API
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
   * المزامنة من جميع المصادر المكونة
   */
  private async syncFromSources(): Promise<void> {
    if (this.isSyncing) {
      console.log('⏳ المزامنة قيد التنفيذ بالفعل...');
      return;
    }

    this.isSyncing = true;
    
    try {
      console.log('🔄 بدء المزامنة التلقائية المحسنة...');
      
      let newArticlesCount = 0;
      const allNewsItems: NewsItem[] = [];
      
      // جلب الأخبار من تغذيات RSS
      if (this.config.sources.rss) {
        try {
          const rssItems = await this.rssService.fetchAllFeeds();
          allNewsItems.push(...rssItems);
          console.log(`📰 تم جلب ${rssItems.length} خبر من RSS`);
        } catch (error) {
          console.error('خطأ في جلب أخبار RSS:', error);
          toast.error('فشل في جلب أخبار RSS');
        }
      }
      
      // جلب المنشورات من صفحات فيسبوك (إذا كان مفعلاً)
      if (this.config.sources.facebook) {
        try {
          const facebookItems = await this.facebookService.fetchAllPages();
          allNewsItems.push(...facebookItems);
          console.log(`📘 تم جلب ${facebookItems.length} منشور من فيسبوك`);
        } catch (error) {
          console.error('خطأ في جلب منشورات فيسبوك:', error);
        }
      }
      
      // إضافة الأخبار الجديدة
      if (allNewsItems.length > 0) {
        newArticlesCount = this.addNewArticles(allNewsItems);
      }
      
      // إرسال حدث للإشعار بالتحديث
      window.dispatchEvent(new CustomEvent('articlesUpdated', {
        detail: { newCount: newArticlesCount }
      }));
      
      // عرض إشعار للمستخدم
      if (newArticlesCount > 0) {
        toast.success(`✅ تم إضافة ${newArticlesCount} خبر جديد`, {
          description: `آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')}`,
          duration: 5000
        });
        console.log(`✅ تم إضافة ${newArticlesCount} خبر جديد إلى الموقع`);
      } else if (!this.isFirstRun) {
        toast.info('🔍 تم فحص المصادر - لا توجد أخبار جديدة', {
          description: `آخر فحص: ${new Date().toLocaleTimeString('ar-EG')}`,
          duration: 3000
        });
      }
      
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
    
    // تصفية الأخبار المكررة بناءً على العنوان والمصدر
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
      
      // الاحتفاظ بآخر 500 خبر فقط لتجنب امتلاء التخزين
      const limitedArticles = updatedArticles.slice(0, 500);
      
      // حفظ الأخبار المحدثة
      localStorage.setItem('articles', JSON.stringify(limitedArticles));
      
      console.log(`✅ تم إضافة ${uniqueNewArticles.length} مقال جديد`);
    }
    
    return uniqueNewArticles.length;
  }

  /**
   * التحقق من تشابه المقالات لتجنب التكرار
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
    if (existing.content && newArticle.content && 
        existing.content.length < 200 && newArticle.content.length < 200) {
      const contentSimilarity = this.calculateSimilarity(existing.content, newArticle.content);
      return contentSimilarity > 0.9;
    }
    
    return false;
  }

  /**
   * حساب درجة التشابه بين نصين
   */
  private calculateSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const norm1 = normalize(text1);
    const norm2 = normalize(text2);
    
    if (norm1 === norm2) return 1;
    
    const words1 = norm1.split(/\s+/);
    const words2 = norm2.split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return commonWords.length / totalWords;
  }

  /**
   * بدء المزامنة التلقائية
   */
  private startAutoSync(): void {
    if (!this.config.enabled) return;
    
    // تنفيذ أول مزامنة بعد 5 ثوان من بدء التطبيق
    setTimeout(() => this.syncFromSources(), 5000);
    
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
    
    toast.info('بدء المزامنة اليدوية...');
    this.syncFromSources();
  }

  /**
   * الحصول على حالة المزامنة
   */
  public getSyncStatus(): { isEnabled: boolean; isSyncing: boolean; nextSync: string } {
    const nextSyncTime = this.syncInterval ? 
      new Date(Date.now() + this.config.interval * 60 * 1000).toLocaleTimeString('ar-EG') : 
      'غير محدد';
    
    return {
      isEnabled: this.config.enabled,
      isSyncing: this.isSyncing,
      nextSync: nextSyncTime
    };
  }

  /**
   * تنظيف الموارد عند إغلاق التطبيق
   */
  public destroy(): void {
    this.stopAutoSync();
    EnhancedAutoSyncService.instance = null;
  }
}

export default EnhancedAutoSyncService;
