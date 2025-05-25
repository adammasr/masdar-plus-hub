import { useEffect } from 'react';
import { EnhancedAutoSyncService } from '../services/EnhancedAutoSyncService';

/**
 * هذا الهوك يقوم بتهيئة وإدارة خدمة المزامنة التلقائية المحسنة
 * يجب استخدامه في المكون الرئيسي للتطبيق (App.tsx)
 */
export const useEnhancedAutoSync = () => {
  useEffect(() => {
    // تهيئة خدمة المزامنة التلقائية المحسنة
    console.log('🚀 تهيئة خدمة المزامنة التلقائية المحسنة...');
    const autoSync = EnhancedAutoSyncService.getInstance();
    
    // تنفيذ مزامنة يدوية عند بدء التطبيق
    setTimeout(() => {
      autoSync.manualSync();
    }, 3000);
    
    return () => {
      // تنظيف الخدمة عند إغلاق التطبيق
      console.log('🧹 تنظيف خدمة المزامنة التلقائية المحسنة...');
      autoSync.destroy();
    };
  }, []);
};

export default useEnhancedAutoSync;
