
import { toast } from "sonner";

interface SyncConfig {
  enabled: boolean;
  interval: number; // in minutes
  sources: {
    rss: boolean;
    facebook: boolean;
  };
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  source: string;
  image: string;
  featured: boolean;
  videoUrl?: string;
}

export class AutoSyncService {
  private static instance: AutoSyncService | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private config: SyncConfig;
  private isFirstRun: boolean = true;

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
      interval: 15, // كل 15 دقيقة
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
      
      let newArticlesCount = 0;
      
      if (this.config.sources.rss) {
        newArticlesCount += await this.syncRSSFeeds();
      }
      
      if (this.config.sources.facebook) {
        newArticlesCount += await this.syncFacebookPages();
      }

      // إرسال حدث للإشعار بالتحديث
      window.dispatchEvent(new CustomEvent('articlesUpdated', {
        detail: { newCount: newArticlesCount }
      }));
      
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

  private async syncRSSFeeds(): Promise<number> {
    console.log('📡 مزامنة مصادر RSS...');
    
    const mockNews: NewsItem[] = [
      {
        id: `rss-${Date.now()}-1`,
        title: `أخبار عاجلة من مصادر RSS - ${new Date().toLocaleString('ar-EG')}`,
        content: 'تفاصيل الخبر العاجل مع تغطية شاملة للأحداث الجارية في المنطقة، حيث تشهد المنطقة تطورات مهمة تستدعي المتابعة المستمرة من قبل المختصين والمراقبين السياسيين.',
        excerpt: 'أخبار عاجلة تتضمن تطورات مهمة في المنطقة',
        category: 'أخبار',
        date: new Date().toISOString().split('T')[0],
        source: 'مصادر RSS',
        image: 'https://picsum.photos/600/400?random=' + Date.now(),
        featured: Math.random() > 0.7
      },
      {
        id: `rss-${Date.now()}-2`,
        title: `تطورات اقتصادية جديدة - ${new Date().toLocaleString('ar-EG')}`,
        content: 'تحليل شامل للوضع الاقتصادي الحالي مع استعراض أهم المؤشرات والبيانات الاقتصادية التي تؤثر على الأسواق المحلية والعالمية.',
        excerpt: 'تحليل شامل للمؤشرات الاقتصادية الحالية',
        category: 'اقتصاد',
        date: new Date().toISOString().split('T')[0],
        source: 'وكالات اقتصادية',
        image: 'https://picsum.photos/600/400?random=' + (Date.now() + 1),
        featured: false
      }
    ];

    return this.addNewArticles(mockNews);
  }

  private async syncFacebookPages(): Promise<number> {
    console.log('📘 مزامنة صفحات فيسبوك...');
    
    const mockFacebookNews: NewsItem[] = [
      {
        id: `fb-${Date.now()}-1`,
        title: `خبر من صفحات فيسبوك - ${new Date().toLocaleString('ar-EG')}`,
        content: 'محتوى الخبر من صفحة فيسبوك مع إعادة صياغة احترافية تتضمن كافة التفاصيل المهمة والمعلومات الضرورية للقارئ.',
        excerpt: 'ملخص الخبر من صفحة فيسبوك',
        category: 'أخبار',
        date: new Date().toISOString().split('T')[0],
        source: 'صفحات فيسبوك',
        image: 'https://picsum.photos/600/400?random=' + (Date.now() + 2),
        featured: false
      }
    ];

    return this.addNewArticles(mockFacebookNews);
  }

  private addNewArticles(newArticles: NewsItem[]): number {
    const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    const uniqueNewArticles = newArticles.filter(newArticle => 
      !existingArticles.some((existing: any) => 
        existing.title === newArticle.title || 
        existing.id === newArticle.id
      )
    );

    if (uniqueNewArticles.length > 0) {
      const updatedArticles = [...uniqueNewArticles, ...existingArticles];
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      
      console.log(`✅ تم إضافة ${uniqueNewArticles.length} مقال جديد`);
    }

    return uniqueNewArticles.length;
  }

  private startAutoSync(): void {
    if (!this.config.enabled) return;

    // تنفيذ أول مزامنة فورية
    setTimeout(() => this.syncFromSources(), 2000);

    this.syncInterval = setInterval(() => {
      this.syncFromSources();
    }, this.config.interval * 60 * 1000);
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

  manualSync(): void {
    this.syncFromSources();
  }

  destroy(): void {
    this.stopAutoSync();
    AutoSyncService.instance = null;
  }
}
