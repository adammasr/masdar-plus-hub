
import { toast } from "sonner";

interface SyncConfig {
  enabled: boolean;
  interval: number; // in minutes
  sources: {
    rss: boolean;
    facebook: boolean;
  };
}

export class AutoSyncService {
  private static instance: AutoSyncService | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private config: SyncConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.startAutoSync();
  }

  static getInstance(): AutoSyncService {
    if (!AutoSyncService.instance) {
      AutoSyncService.instance = new AutoSyncService();
    }
    return AutoSyncService.instance;
  }

  private loadConfig(): SyncConfig {
    const saved = localStorage.getItem('autoSyncConfig');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      interval: 30, // كل 30 دقيقة
      sources: {
        rss: true,
        facebook: true
      }
    };
  }

  private saveConfig(): void {
    localStorage.setItem('autoSyncConfig', JSON.stringify(this.config));
  }

  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.restartAutoSync();
  }

  private async syncFromSources(): Promise<void> {
    try {
      console.log('🔄 بدء المزامنة التلقائية...');
      
      if (this.config.sources.rss) {
        await this.syncRSSFeeds();
      }
      
      if (this.config.sources.facebook) {
        await this.syncFacebookPages();
      }

      // إرسال حدث للإشعار بالتحديث
      window.dispatchEvent(new CustomEvent('articlesUpdated'));
      
      toast.success('تم تحديث الأخبار تلقائياً', {
        description: `آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')}`,
        duration: 3000
      });

    } catch (error) {
      console.error('خطأ في المزامنة التلقائية:', error);
      toast.error('فشل في تحديث الأخبار تلقائياً');
    }
  }

  private async syncRSSFeeds(): Promise<void> {
    // محاكاة سحب الأخبار من RSS
    console.log('📡 مزامنة مصادر RSS...');
    
    // هنا يمكن إضافة منطق سحب الأخبار الفعلي من المصادر
    const mockNews = [
      {
        id: `rss-${Date.now()}-1`,
        title: `خبر عاجل من RSS - ${new Date().toLocaleString('ar-EG')}`,
        content: 'محتوى الخبر من مصدر RSS مع إعادة صياغة احترافية...',
        excerpt: 'ملخص الخبر بشكل موجز ووافي',
        category: 'أخبار',
        date: new Date().toISOString(),
        source: 'RSS Feed',
        image: '/placeholder.svg',
        featured: false
      }
    ];

    // إضافة الأخبار الجديدة
    this.addNewArticles(mockNews);
  }

  private async syncFacebookPages(): Promise<void> {
    // محاكاة سحب الأخبار من فيسبوك
    console.log('📘 مزامنة صفحات فيسبوك...');
    
    const mockFacebookNews = [
      {
        id: `fb-${Date.now()}-1`,
        title: `خبر من فيسبوك - ${new Date().toLocaleString('ar-EG')}`,
        content: 'محتوى الخبر من صفحة فيسبوك مع إعادة صياغة احترافية...',
        excerpt: 'ملخص الخبر من صفحة فيسبوك',
        category: 'أخبار',
        date: new Date().toISOString(),
        source: 'Facebook Page',
        image: '/placeholder.svg',
        featured: false
      }
    ];

    this.addNewArticles(mockFacebookNews);
  }

  private addNewArticles(newArticles: any[]): void {
    // الحصول على المقالات الحالية
    const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // فلترة المقالات الجديدة (تجنب التكرار)
    const uniqueNewArticles = newArticles.filter(newArticle => 
      !existingArticles.some((existing: any) => existing.title === newArticle.title)
    );

    if (uniqueNewArticles.length > 0) {
      // إضافة المقالات الجديدة
      const updatedArticles = [...uniqueNewArticles, ...existingArticles];
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      
      console.log(`✅ تم إضافة ${uniqueNewArticles.length} مقال جديد`);
    }
  }

  private startAutoSync(): void {
    if (!this.config.enabled) return;

    this.syncInterval = setInterval(() => {
      this.syncFromSources();
    }, this.config.interval * 60 * 1000);

    // تنفيذ أول مزامنة فورية
    setTimeout(() => this.syncFromSources(), 5000);
  }

  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private restartAutoSync(): void {
    this.stopAutoSync();
    this.startAutoSync();
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  destroy(): void {
    this.stopAutoSync();
    AutoSyncService.instance = null;
  }
}
