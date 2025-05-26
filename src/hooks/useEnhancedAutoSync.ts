
import { useEffect } from 'react';
import { EnhancedAutoSyncService } from '../services/EnhancedAutoSyncService';

/**
 * هذا الهوك يقوم بتهيئة وإدارة خدمة المزامنة التلقائية المحسنة الجديدة
 * يجب استخدامه في المكون الرئيسي للتطبيق (App.tsx)
 */
export const useEnhancedAutoSync = () => {
  useEffect(() => {
    // تهيئة خدمة المزامنة التلقائية المحسنة الجديدة
    console.log('🚀 تهيئة خدمة المزامنة التلقائية المحسنة مع NewsAPI و الذكاء الاصطناعي...');
    const autoSync = EnhancedAutoSyncService.getInstance();
    
    // تنفيذ مزامنة يدوية عند بدء التطبيق بعد تأخير قصير
    setTimeout(() => {
      console.log('🔄 بدء أول مزامنة تلقائية...');
      autoSync.manualSync();
    }, 5000);
    
    return () => {
      // تنظيف الخدمة عند إغلاق التطبيق
      console.log('🧹 تنظيف خدمة المزامنة التلقائية المحسنة...');
      autoSync.destroy();
    };
  }, []);
};

export default useEnhancedAutoSync;
