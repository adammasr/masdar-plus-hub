import axios from 'axios';
import { NewsItem } from '../../types/NewsItem';

/**
 * خدمة متخصصة في جلب وإدارة صور الأخبار
 * تضمن وجود صورة مناسبة لكل خبر حتى في حالة عدم توفر الصورة الأصلية
 */
export class ImageService {
  private static instance: ImageService | null = null;
  
  // مجموعة من الصور الاحتياطية مصنفة حسب الفئات
  private fallbackImages: Record<string, string[]> = {
    'سياسة': [
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60'
    ],
    'اقتصاد': [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60'
    ],
    'محافظات': [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=60'
    ],
    'ذكاء اصطناعي': [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=60'
    ],
    'تكنولوجيا': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60'
    ],
    'عسكرية': [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800&auto=format&fit=crop&q=60'
    ],
    'العالم': [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1457464901128-858c524a9b7b?w=800&auto=format&fit=crop&q=60'
    ],
    'رياضة': [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60'
    ],
    'فن وثقافة': [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop&q=60'
    ],
    'سيارات': [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1494976688153-c91c18981875?w=800&auto=format&fit=crop&q=60'
    ],
    'علوم': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=60'
    ],
    'جامعات وتعليم': [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60'
    ],
    'حوادث': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&auto=format&fit=crop&q=60'
    ],
    'أخبار': [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&auto=format&fit=crop&q=60'
    ]
  };

  private constructor( ) {}

  /**
   * الحصول على نسخة واحدة من الخدمة (نمط Singleton)
   */
  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  /**
   * استخراج صورة من محتوى HTML
   */
  public extractImageFromContent(content: string): string | null {
    try {
      // البحث عن وسم img
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const match = content.match(imgRegex);
      
      if (match && match[1]) {
        return match[1];
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في استخراج الصورة من المحتوى:', error);
      return null;
    }
  }

  /**
   * التحقق من صلاحية رابط الصورة
   */
  public async isImageValid(imageUrl: string): Promise<boolean> {
    if (!imageUrl || !imageUrl.startsWith('http' )) {
      return false;
    }

    try {
      // محاولة الوصول للصورة للتأكد من صلاحيتها
      const response = await axios.head(imageUrl, {
        timeout: 5000, // 5 ثوان كحد أقصى
        validateStatus: (status) => status === 200
      });
      
      return response.status === 200;
    } catch (error) {
      console.warn(`صورة غير صالحة: ${imageUrl}`);
      return false;
    }
  }

  /**
   * الحصول على صورة بديلة مناسبة للفئة
   */
  public getFallbackImage(category: string): string {
    const categoryImages = this.fallbackImages[category] || this.fallbackImages['أخبار'];
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    return categoryImages[randomIndex];
  }

  /**
   * ضمان وجود صورة صالحة لكل خبر
   * إذا كانت الصورة الأصلية غير صالحة، يتم استخدام صورة بديلة
   */
  public async ensureValidImage(newsItem: NewsItem): Promise<NewsItem> {
    // نسخة من الخبر لتجنب تعديل الأصل
    const updatedItem = { ...newsItem };
    
    // التحقق من وجود صورة أصلية
    if (!updatedItem.image || !(await this.isImageValid(updatedItem.image))) {
      // محاولة استخراج صورة من المحتوى
      if (updatedItem.content) {
        const extractedImage = this.extractImageFromContent(updatedItem.content);
        if (extractedImage && (await this.isImageValid(extractedImage))) {
          updatedItem.image = extractedImage;
        } else {
          // استخدام صورة بديلة مناسبة للفئة
          updatedItem.image = this.getFallbackImage(updatedItem.category);
        }
      } else {
        // استخدام صورة بديلة مناسبة للفئة
        updatedItem.image = this.getFallbackImage(updatedItem.category);
      }
    }
    
    return updatedItem;
  }

  /**
   * معالجة مجموعة من الأخبار للتأكد من وجود صور صالحة
   */
  public async processNewsItems(newsItems: NewsItem[]): Promise<NewsItem[]> {
    const processedItems: NewsItem[] = [];
    
    for (const item of newsItems) {
      const processedItem = await this.ensureValidImage(item);
      processedItems.push(processedItem);
    }
    
    return processedItems;
  }
}

export default ImageService;
