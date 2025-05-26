
import React from 'react';
import { Card } from '@/components/ui/card';

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'article' | 'footer';
  className?: string;
}

// خدمة إدارة الإعلانات
export const AdSlot: React.FC<AdSlotProps> = ({ position, className = '' }) => {
  // قراءة الإعلانات من localStorage
  const getAds = () => {
    try {
      const ads = localStorage.getItem('siteAds');
      return ads ? JSON.parse(ads) : {};
    } catch {
      return {};
    }
  };

  const ads = getAds();
  const adContent = ads[position];

  // إذا لم يكن هناك إعلان محدد لهذا الموضع
  if (!adContent) {
    return null;
  }

  return (
    <div className={`ad-slot ad-${position} ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-1">إعلان</div>
      <Card className="p-4 bg-gray-50 border-dashed border-2 border-gray-200">
        {adContent.type === 'image' ? (
          <div className="text-center">
            <img 
              src={adContent.url} 
              alt={adContent.title || 'إعلان'}
              className="max-w-full h-auto mx-auto"
              style={{ maxHeight: position === 'sidebar' ? '300px' : '200px' }}
            />
            {adContent.title && (
              <p className="mt-2 text-sm font-medium">{adContent.title}</p>
            )}
            {adContent.description && (
              <p className="text-xs text-gray-600">{adContent.description}</p>
            )}
            {adContent.link && (
              <a 
                href={adContent.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                اقرأ المزيد
              </a>
            )}
          </div>
        ) : adContent.type === 'text' ? (
          <div className="text-center">
            {adContent.title && (
              <h3 className="font-bold text-lg mb-2">{adContent.title}</h3>
            )}
            {adContent.description && (
              <p className="text-gray-700 mb-3">{adContent.description}</p>
            )}
            {adContent.link && (
              <a 
                href={adContent.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                {adContent.buttonText || 'زيارة الموقع'}
              </a>
            )}
          </div>
        ) : (
          // HTML مخصص
          <div dangerouslySetInnerHTML={{ __html: adContent.html }} />
        )}
      </Card>
    </div>
  );
};

// مكون الإعلان الجانبي
export const SidebarAd: React.FC = () => {
  return (
    <div className="w-80 hidden lg:block bg-gray-50 p-4 border-r">
      <div className="sticky top-4 space-y-6">
        <AdSlot position="sidebar" />
        
        {/* إعلان إضافي ثابت للشريط الجانبي */}
        <Card className="p-4 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200">
          <div className="text-center">
            <h3 className="font-bold text-blue-800 mb-2">مصدر بلس</h3>
            <p className="text-blue-700 text-sm mb-3">
              أحدث الأخبار المصرية والعربية
            </p>
            <div className="bg-blue-500 text-white p-3 rounded">
              <div className="text-lg font-bold">تابعنا</div>
              <div className="text-sm">للحصول على آخر الأخبار</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdSlot;
