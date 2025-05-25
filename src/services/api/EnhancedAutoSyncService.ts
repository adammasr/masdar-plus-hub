import { NewsItem } from '../../types/NewsItem';
import { GeminiService } from './GeminiService';
import { RssService } from './RssService';
import { FacebookService } from './FacebookService';
import { ImageService } from './ImageService';
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
 * وتضمن وجود صور صالحة لكل خبر
 */
export class EnhancedAutoSyncService {
  private static instance: EnhancedAutoSyncService | null = null;
  private config: SyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isFirstRun: boolean = true;
  
  // الخدمات المستخدمة
  private rssService: RssService;
  private facebookService: FacebookService;
  private geminiService: GeminiService;
  private imageService: ImageService;

  private constructor() {
    // تهيئة الخدمات
    this.rssService = RssService.getInstance();
    this.facebookService = FacebookService.getInstance();
    this.geminiService = GeminiService.getInstance();
    this.imageService = ImageService.getInstance();
    
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
    
    // تحديث API key لـ Gemini من متغيرات البيئة إذا كان متاحاً
    this.updateGeminiApiKey();
    
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
      sources: {
        rss: true,
        facebook: true
      }
    };
  }

  /**
   * تحديث API key لـ Gemini من متغيرات البيئة
   */
  private updateGeminiApiKey(): void {
    // محاولة الحصول على API key من متغيرات البيئة
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAzQEejlpDswE6uoLVWUkUgSh_VNT0FlP0';
    
    // تحديث تكوين خدمة Gemini
    this.geminiService.updateConfig({
      apiKey: apiKey
    });
    
    console.log('✅ تم تحديث API key لـ Gemini');
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
    try {
      console.log('🔄 بدء المزامنة التلقائية المحسنة...');
      
      let newArticlesCount = 0;
      const allNewsItems: NewsItem[] = [];
      
      // جلب الأخبار من تغذيات RSS
      if (this.config.sources.rss) {
        const rssItems = await this.rssService.fetchAllFeeds();
        allNewsItems.push(...rssItems);
      }
      
      // جلب المنشورات من صفحات فيسبوك
      if (this.config.sources.facebook) {
        const facebookItems = await this.facebookService.fetchAllPages();
        allNewsItems.push(...facebookItems);
      }
      
      // معالجة الصور لجميع الأخبار
      const processedItems = await this.imageService.processNewsItems(allNewsItems);
      
      // إضافة الأخبار الجديدة
      if (processedItems.length > 0) {
        newArticlesCount = this.addNewArticles(processedItems);
      }
      
      // إرسال حدث للإشعار بالتحديث
      window.dispatchEvent(new CustomEvent('articlesUpdated', {
        detail: { newCount: newArticlesCount }
      }));
      
      // عرض إشعار للمستخدم
      if (newArticlesCount > 0) {
        toast.success(`تم إضافة ${newArticlesCount} خبر جديد`, {
          description: `آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')}`,
          duration: 5000
        });
      } else if (!this.isFirstRun) {
        toast.info('تم فحص المصادر - لا توجد أخبار جديدة', {
          description: `آخر فحص: ${new Date().toLocaleTimeString('ar-EG')}`,
          duration: 3000
        });
      }
      
      this.isFirstRun = false;
    } catch (error) {
      console.error('خطأ في المزامنة التلقائية:', error);
      toast.error('فشل في تحديث الأخبار تلقائياً');
    }
  }

  /**
   * إضافة الأخبار الجديدة إلى التخزين المحلي
   */
  private addNewArticles(newArticles: NewsItem[]): number {
    const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // تصفية الأخبار المكررة
    const uniqueNewArticles = newArticles.filter(newArticle => 
      !existingArticles.some((existing: any) => 
        existing.title === newArticle.title || 
        existing.id === newArticle.id
      )
    );
    
    if (uniqueNewArticles.length > 0) {
      // دمج الأخبار الجديدة مع الموجودة
      const updatedArticles = [...uniqueNewArticles, ...existingArticles];
      
      // حفظ الأخبار المحدثة
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      
      console.log(`✅ تم إضافة ${uniqueNewArticles.length} مقال جديد`);
    }
    
    return uniqueNewArticles.length;
  }

  /**
   * بدء المزامنة التلقائية
   */
  private startAutoSync(): void {
    if (!this.config.enabled) return;
    
    // تنفيذ أول مزامنة فورية
    setTimeout(() => this.syncFromSources(), 2000);
    
    // إعداد المزامنة الدورية
    this.syncInterval = setInterval(() => {
      this.syncFromSources();
    }, this.config.interval * 60 * 1000);
  }

  /**
   * إيقاف المزامنة التلقائية
   */
  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
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
    this.syncFromSources();
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
