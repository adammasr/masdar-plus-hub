import { useState, useEffect } from 'react';

/**
 * هوك لإدارة وضع السمة (فاتح/داكن)
 * يحفظ الإعداد في التخزين المحلي ويطبقه على عنصر الجسم
 */
export const useTheme = () => {
  // التحقق من وجود تفضيل مسبق في التخزين المحلي أو استخدام تفضيل النظام
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // التحقق من تفضيل النظام
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // تهيئة الوضع عند تحميل الصفحة
  useEffect(() => {
    setIsDarkMode(getInitialTheme());
  }, []);
  
  // تطبيق الوضع عند تغييره
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // تبديل الوضع
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return { isDarkMode, toggleTheme };
};

export default useTheme;
