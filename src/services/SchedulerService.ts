  /**
 * خدمة الجدولة المحسنة للتحديث التلقائي على مدار الساعة
 * تدعم جدولة متعددة المستويات وإدارة الأخطاء المتقدمة
 */

import { EnhancedAutoSyncService } from './EnhancedAutoSyncService';

export interface ScheduleConfig {
  interval: number; // بالدقائق
  maxRetries: number;
  retryDelay: number; // بالثواني
  enabled: boolean;
}

export class SchedulerService {
  private static instance: SchedulerService;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;
  private autoSyncService: EnhancedAutoSyncService;

  // إعدادات الجدولة المختلفة
  private schedules: Map<string, ScheduleConfig> = new Map([
    ['main', { interval: 30, maxRetries: 3, retryDelay: 60, enabled: true }], // كل 30 دقيقة
    ['priority', { interval: 15, maxRetries: 5, retryDelay: 30, enabled: true }], // كل 15 دقيقة للأخبار العاجلة
    ['backup', { interval: 120, maxRetries: 2, retryDelay: 300, enabled: true }], // كل ساعتين كنسخ احتياطي
  ]);

  private constructor() {
    this.autoSyncService = EnhancedAutoSyncService.getInstance();
  }

  public static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  /**
   * بدء جميع الجدولات
   */
  public start(): void {
    if (this.isRunning) {
      console.log('⚠️ خدمة الجدولة تعمل بالفعل');
      return;
    }

    console.log('🚀 بدء خدمة الجدولة التلقائية...');
    this.isRunning = true;

    // بدء الجدولات المختلفة
    this.schedules.forEach((config, name) => {
      if (config.enabled) {
        this.startSchedule(name, config);
      }
    });

    // جدولة تنظيف دورية للذاكرة
    this.startMemoryCleanup();

    console.log('✅ تم بدء جميع الجدولات بنجاح');
  }

  /**
   * إيقاف جميع الجدولات
   */
  public stop(): void {
    console.log('🛑 إيقاف خدمة الجدولة...');
    
    this.intervals.forEach((interval, name) => {
      clearInterval(interval);
      console.log(`⏹️ تم إيقاف الجدولة: ${name}`);
    });
    
    this.intervals.clear();
    this.isRunning = false;
    
    console.log('✅ تم إيقاف جميع الجدولات');
  }

  /**
   * بدء جدولة محددة
   */
  private startSchedule(name: string, config: ScheduleConfig): void {
    const intervalMs = config.interval * 60 * 1000; // تحويل إلى ميلي ثانية
    
    console.log(`⏰ بدء الجدولة "${name}" - كل ${config.interval} دقيقة`);
    
    const interval = setInterval(async () => {
      await this.executeScheduledTask(name, config);
    }, intervalMs);
    
    this.intervals.set(name, interval);
    
    // تنفيذ فوري للجدولة الرئيسية
    if (name === 'main') {
      setTimeout(() => this.executeScheduledTask(name, config), 5000);
    }
  }

  /**
   * تنفيذ مهمة مجدولة مع إدارة الأخطاء
   */
  private async executeScheduledTask(scheduleName: string, config: ScheduleConfig): Promise<void> {
    console.log(`🔄 تنفيذ الجدولة: ${scheduleName}`);
    
    let retries = 0;
    let success = false;
    
    while (retries <= config.maxRetries && !success) {
      try {
        // تنفيذ المزامنة حسب نوع الجدولة
        switch (scheduleName) {
          case 'main':
            await this.autoSyncService.manualSync();
            break;
          case 'priority':
            await this.autoSyncService.syncPriorityNews();
            break;
          case 'backup':
            await this.autoSyncService.backupSync();
            break;
          default:
            await this.autoSyncService.manualSync();
        }
        
        success = true;
        console.log(`✅ نجح تنفيذ الجدولة: ${scheduleName}`);
        
      } catch (error) {
        retries++;
        console.error(`❌ خطأ في الجدولة ${scheduleName} (المحاولة ${retries}/${config.maxRetries + 1}):`, error);
        
        if (retries <= config.maxRetries) {
          console.log(`⏳ إعادة المحاولة خلال ${config.retryDelay} ثانية...`);
          await this.delay(config.retryDelay * 1000);
        }
      }
    }
    
    if (!success) {
      console.error(`💥 فشل في تنفيذ الجدولة ${scheduleName} بعد ${config.maxRetries + 1} محاولات`);
      // يمكن إضافة إشعارات أو تسجيل في قاعدة البيانات هنا
    }
  }

  /**
   * بدء تنظيف دوري للذاكرة
   */
  private startMemoryCleanup(): void {
    const cleanupInterval = setInterval(() => {
      if (global.gc) {
        global.gc();
        console.log('🧹 تم تنظيف الذاكرة');
      }
    }, 30 * 60 * 1000); // كل 30 دقيقة
    
    this.intervals.set('cleanup', cleanupInterval);
  }

  /**
   * تحديث إعدادات جدولة محددة
   */
  public updateScheduleConfig(name: string, config: Partial<ScheduleConfig>): void {
    const currentConfig = this.schedules.get(name);
    if (currentConfig) {
      const newConfig = { ...currentConfig, ...config };
      this.schedules.set(name, newConfig);
      
      // إعادة تشغيل الجدولة بالإعدادات الجديدة
      if (this.intervals.has(name)) {
        clearInterval(this.intervals.get(name)!);
        this.intervals.delete(name);
      }
      
      if (newConfig.enabled && this.isRunning) {
        this.startSchedule(name, newConfig);
      }
      
      console.log(`⚙️ تم تحديث إعدادات الجدولة: ${name}`, newConfig);
    }
  }

  /**
   * الحصول على حالة الجدولة
   */
  public getStatus(): { isRunning: boolean; activeSchedules: string[]; configs: Map<string, ScheduleConfig> } {
    return {
      isRunning: this.isRunning,
      activeSchedules: Array.from(this.intervals.keys()),
      configs: new Map(this.schedules)
    };
  }

  /**
   * تنفيذ مزامنة فورية لجميع الجدولات
   */
  public async forceSync(): Promise<void> {
    console.log('🚀 تنفيذ مزامنة فورية لجميع الجدولات...');
    
    const promises = Array.from(this.schedules.entries())
      .filter(([_, config]) => config.enabled)
      .map(([name, config]) => this.executeScheduledTask(name, config));
    
    try {
      await Promise.allSettled(promises);
      console.log('✅ تم تنفيذ المزامنة الفورية لجميع الجدولات');
    } catch (error) {
      console.error('❌ خطأ في المزامنة الفورية:', error);
    }
  }

  /**
   * دالة مساعدة للتأخير
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * تدمير الخدمة وتنظيف الموارد
   */
  public destroy(): void {
    this.stop();
    SchedulerService.instance = null as any;
  }
}
