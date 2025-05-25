// تحسين خدمة جلب الصور للأخبار
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
      'https://cdn.pixabay.com/photo/2019/04/14/08/09/egypt-4126012_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/10/17/19/11/egypt-2861308_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/11/04/20/59/egypt-1023331_1280.jpg'
    ],
    'اقتصاد': [
      'https://cdn.pixabay.com/photo/2017/12/26/09/15/woman-3040029_1280.jpg',
      'https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg',
      'https://cdn.pixabay.com/photo/2020/07/23/01/29/finance-5430089_1280.jpg'
    ],
    'محافظات': [
      'https://cdn.pixabay.com/photo/2020/01/20/19/08/alexandria-4781602_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/01/14/13/59/egypt-1979445_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/12/16/22/22/egypt-3023003_1280.jpg'
    ],
    'ذكاء اصطناعي': [
      'https://cdn.pixabay.com/photo/2018/09/27/09/22/artificial-intelligence-3706562_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/05/10/19/29/robot-2301646_1280.jpg',
      'https://cdn.pixabay.com/photo/2020/01/31/07/26/robot-4807311_1280.jpg'
    ],
    'عسكرية': [
      'https://cdn.pixabay.com/photo/2016/03/27/19/29/soldier-1283789_1280.jpg',
      'https://cdn.pixabay.com/photo/2018/05/11/09/51/peace-3390611_1280.jpg',
      'https://cdn.pixabay.com/photo/2014/10/02/06/34/military-helicopter-469200_1280.jpg'
    ],
    'العالم': [
      'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/08/14/08/39/globe-2639507_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/06/14/08/20/map-of-the-world-2401458_1280.jpg'
    ],
    'أخبار': [
      'https://cdn.pixabay.com/photo/2017/08/10/02/05/tiles-shapes-2617112_1280.jpg',
      'https://cdn.pixabay.com/photo/2016/02/01/00/56/news-1172463_1280.jpg',
      'https://cdn.pixabay.com/photo/2014/05/21/22/28/old-newspaper-350376_1280.jpg'
    ]
  };

  private constructor() {}

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
    if (!imageUrl || !imageUrl.startsWith('http')) {
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
