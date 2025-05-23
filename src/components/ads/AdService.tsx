
import { useEffect, useState } from "react";
import { Ad } from "./types";
import AdBanner from "./AdBanner";

// مكون AdService للتعامل مع الإعلانات في مختلف أقسام الموقع
export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // استرجاع الإعلانات من التخزين المحلي
    const savedAds = localStorage.getItem("siteAds");
    if (savedAds) {
      try {
        const parsedAds = JSON.parse(savedAds);
        setAds(parsedAds.filter((ad: Ad) => ad.isActive));
      } catch (e) {
        console.error("خطأ في تحميل الإعلانات:", e);
        setAds([]);
      }
    }
    setLoaded(true);
  }, []);

  // الحصول على إعلان حسب الموقع
  const getAdByPosition = (position: string): Ad | null => {
    if (!loaded) return null;
    
    const positionAds = ads.filter(ad => ad.position === position);
    if (positionAds.length === 0) return null;
    
    // إذا كان هناك عدة إعلانات في نفس الموقع، اختر واحدًا عشوائيًا
    const randomIndex = Math.floor(Math.random() * positionAds.length);
    return positionAds[randomIndex];
  };

  return {
    getAdByPosition,
    loaded,
  };
};

// مكون للعرض السهل للإعلانات في مواقع محددة
interface AdSlotProps {
  position: string;
  className?: string;
}

export const AdSlot = ({ position, className = "" }: AdSlotProps) => {
  const { getAdByPosition, loaded } = useAds();
  
  if (!loaded) return null;
  
  const ad = getAdByPosition(position);
  if (!ad) return null;
  
  return (
    <div className={className}>
      <AdBanner ad={ad} />
    </div>
  );
};
