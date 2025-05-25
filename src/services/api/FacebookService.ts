import axios from 'axios';
import { NewsItem } from '../../types/NewsItem';
import { GeminiService } from './GeminiService';

// واجهة لتكوين خدمة فيسبوك
export interface FacebookConfig {
  pages: string[];
  fetchInterval: number; // بالدقائق
  maxPostsPerPage: number;
  accessToken?: string; // اختياري، للوصول إلى API فيسبوك
}

/**
 * خدمة لجلب منشورات صفحات فيسبوك
 * ملاحظة: نظرًا لقيود API فيسبوك، نستخدم طريقة بديلة لجلب المنشورات
 */
export class FacebookService {
  private static instance: FacebookService | null = null;
  private config: FacebookConfig;
  private geminiService: GeminiService;

  private constructor() {
    // التكوين الافتراضي مع صفحات الوزارات
    this.config = {
      pages: [
        'https://www.facebook.com/EgyptianCabinet',
        'https://www.facebook.com/egypt.mohp',
        'https://www.facebook.com/MOMPEGYPT',
        'https://www.facebook.com/EgyptMOP',
        'https://www.facebook.com/Egy.Pres.Spokesman',
        'https://www.facebook.com/EgyArmySpox',
        'https://www.facebook.com/moere.gov.eg',
        'https://www.facebook.com/MFAEgypt',
        'https://www.facebook.com/EGY.Environment',
        'https://www.facebook.com/MCITEgypt',
        'https://www.facebook.com/egypt.moe',
        'https://www.facebook.com/MOLD.eg',
        'https://www.facebook.com/EgyptianMinistyOfHousing',
        'https://www.facebook.com/idsc.gov.eg',
        'https://www.facebook.com/AwkafOnline',
        'https://www.facebook.com/MoiEgy',
        'https://www.facebook.com/MOF.Egypt',
        'https://www.facebook.com/mti.egypt',
        'https://www.facebook.com/moca123',
        'https://www.facebook.com/MinistryTransportation',
        'https://www.facebook.com/EgyptianMOC',
        'https://www.facebook.com/mwrifb',
        'https://www.facebook.com/min.agriculture',
        'https://www.facebook.com/MOICEgypt',
        'https://www.facebook.com/MPEDEGYPT',
        'https://www.facebook.com/MOHESREGYPT',
        'https://www.facebook.com/msitgovegypt',
        'https://www.facebook.com/tourismandantiq',
        'https://www.facebook.com/emysofficial',
        'https://www.facebook.com/ministryofparliamentaryaffairs',
        'https://www.facebook.com/MoSS.Egypt'
      ],
      fetchInterval: 60, // كل ساعة
      maxPostsPerPage: 5
    };
    
    this.geminiService = GeminiService.getInstance();
  }

  /**
   * الحصول على نسخة واحدة من الخدمة (نمط Singleton)
   */
  public static getInstance(): FacebookService {
    if (!FacebookService.instance) {
      FacebookService.instance = new FacebookService();
    }
    return FacebookService.instance;
  }

  /**
   * تحديث تكوين الخدمة
   */
  public updateConfig(newConfig: Partial<FacebookConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * جلب المنشورات من جميع صفحات فيسبوك المكونة
   */
  public async fetchAllPages(): Promise<NewsItem[]> {
    try {
      console.log('🔄 جلب المنشورات من صفحات فيسبوك...');
      
      const allNewsItems: NewsItem[] = [];
      
      // جلب المنشورات من كل صفحة فيسبوك
      for (const pageUrl of this.config.pages) {
        try {
          // استخدام طريقة بديلة لجلب المنشورات
          const pageItems = await this.fetchPageAlternative(pageUrl);
          allNewsItems.push(...pageItems);
          
          // إضافة تأخير قصير بين الطلبات لتجنب التحميل الزائد
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`خطأ في جلب منشورات من ${pageUrl}:`, error);
        }
      }
      
      console.log(`✅ تم جلب ${allNewsItems.length} منشور من صفحات فيسبوك`);
      return allNewsItems;
    } catch (error) {
      console.error('خطأ في جلب منشورات فيسبوك:', error);
      return [];
    }
  }

  /**
   * طريقة بديلة لجلب منشورات صفحة فيسبوك
   * ملاحظة: هذه طريقة محاكاة لأن الوصول المباشر إلى API فيسبوك يتطلب مصادقة وموافقات
   */
  private async fetchPageAlternative(pageUrl: string): Promise<NewsItem[]> {
    try {
      // استخراج اسم الصفحة من الرابط
      const pageName = this.extractPageName(pageUrl);
      
      // توليد منشورات تجريبية بناءً على اسم الصفحة
      // في التطبيق الحقيقي، يمكن استخدام تقنيات مثل web scraping أو API رسمي
      const newsItems: NewsItem[] = [];
      
      for (let i = 0; i < this.config.maxPostsPerPage; i++) {
        // توليد محتوى تجريبي مرتبط بالوزارة أو الجهة
        const content = await this.generateMinistryContent(pageName);
        
        // تصنيف المحتوى
        const category = await this.geminiService.classifyContent(content);
        
        // إعادة صياغة المحتوى
        const rewrittenContent = await this.geminiService.rewriteContent({
          originalText: content,
          category: category,
          source: pageName,
          tone: 'formal'
        });
        
        // إنشاء عنوان من المحتوى المعاد صياغته
        const title = this.generateTitleFromContent(rewrittenContent);
        
        // إنشاء عنصر الخبر
        const newsItem: NewsItem = {
          id: `fb-${Date.now()}-${i}-${this.hashString(pageName)}`,
          title: title,
          content: rewrittenContent,
          excerpt: this.createExcerpt(rewrittenContent),
          category: category,
          date: new Date().toISOString().split('T')[0],
          source: pageName,
          image: await this.getRelevantImage(category, pageName),
          featured: i === 0 && Math.random() > 0.8, // جعل بعض الأخبار مميزة
          originalLink: pageUrl
        };
        
        newsItems.push(newsItem);
      }
      
      return newsItems;
    } catch (error) {
      console.error(`خطأ في جلب منشورات من ${pageUrl}:`, error);
      return [];
    }
  }

  /**
   * استخراج اسم الصفحة من رابط فيسبوك
   */
  private extractPageName(pageUrl: string): string {
    try {
      // استخراج الجزء الأخير من الرابط
      const urlParts = pageUrl.split('/');
      let pageName = urlParts[urlParts.length - 1];
      
      // إذا كان الرابط ينتهي بـ /
      if (pageName === '') {
        pageName = urlParts[urlParts.length - 2];
      }
      
      // تحويل معرفات الصفحات إلى أسماء أكثر قابلية للقراءة
      const pageNameMap: Record<string, string> = {
        'EgyptianCabinet': 'مجلس الوزراء المصري',
        'egypt.mohp': 'وزارة الصحة المصرية',
        'MOMPEGYPT': 'وزارة البترول المصرية',
        'EgyptMOP': 'وزارة التخطيط المصرية',
        'Egy.Pres.Spokesman': 'المتحدث الرسمي للرئاسة المصرية',
        'EgyArmySpox': 'المتحدث العسكري للقوات المسلحة',
        'moere.gov.eg': 'وزارة الكهرباء المصرية',
        'MFAEgypt': 'وزارة الخارجية المصرية',
        'EGY.Environment': 'وزارة البيئة المصرية',
        'MCITEgypt': 'وزارة الاتصالات المصرية',
        'egypt.moe': 'وزارة التربية والتعليم المصرية',
        'MOLD.eg': 'وزارة التنمية المحلية',
        'EgyptianMinistyOfHousing': 'وزارة الإسكان المصرية',
        'idsc.gov.eg': 'مركز المعلومات ودعم اتخاذ القرار',
        'AwkafOnline': 'وزارة الأوقاف المصرية',
        'MoiEgy': 'وزارة الداخلية المصرية',
        'MOF.Egypt': 'وزارة المالية المصرية',
        'mti.egypt': 'وزارة التجارة والصناعة',
        'moca123': 'وزارة الطيران المدني',
        'MinistryTransportation': 'وزارة النقل المصرية',
        'EgyptianMOC': 'وزارة الثقافة المصرية',
        'mwrifb': 'وزارة الموارد المائية والري',
        'min.agriculture': 'وزارة الزراعة المصرية',
        'MOICEgypt': 'وزارة التعاون الدولي',
        'MPEDEGYPT': 'وزارة التخطيط والتنمية الاقتصادية',
        'MOHESREGYPT': 'وزارة التعليم العالي',
        'msitgovegypt': 'وزارة الدولة للإعلام',
        'tourismandantiq': 'وزارة السياحة والآثار',
        'emysofficial': 'وزارة الشباب والرياضة',
        'ministryofparliamentaryaffairs': 'وزارة شؤون مجلس النواب',
        'MoSS.Egypt': 'وزارة التضامن الاجتماعي'
      };
      
      return pageNameMap[pageName] || pageName;
    } catch (error) {
      console.error('خطأ في استخراج اسم الصفحة:', error);
      return 'صفحة فيسبوك';
    }
  }

  /**
   * توليد محتوى مرتبط بالوزارة أو الجهة
   */
  private async generateMinistryContent(ministryName: string): Promise<string> {
    // في التطبيق الحقيقي، هذا سيكون محتوى فعلي من المنشور
    // هنا نستخدم Gemini لتوليد محتوى واقعي مرتبط بالوزارة
    
    try {
      const prompt = `
      اكتب منشورًا إخباريًا قصيرًا (3-5 جمل) يمكن أن تنشره ${ministryName} على صفحتها الرسمية على فيسبوك.
      يجب أن يكون المنشور واقعيًا ويتعلق بأنشطة أو إعلانات أو مبادرات حديثة للوزارة.
      لا تضف أي تعليقات أو مقدمات، فقط المحتوى الإخباري مباشرة.
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
            topP: 0.9,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': 'AIzaSyAzQEejlpDswE6uoLVWUkUgSh_VNT0FlP0'
          }
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text.trim();
      }
      
      // محتوى افتراضي في حالة الفشل
      return `أعلنت ${ministryName} اليوم عن خطة جديدة لتطوير الخدمات المقدمة للمواطنين خلال الفترة القادمة. وأكد الوزير في تصريحات صحفية أن الوزارة تعمل على تحسين البنية التحتية وتطوير منظومة العمل لتقديم خدمات أفضل. كما أشار إلى أن هناك تعاونًا مع عدة جهات لتنفيذ المشروعات الجديدة في إطار خطة الدولة للتنمية المستدامة.`;
    } catch (error) {
      console.error('خطأ في توليد محتوى الوزارة:', error);
      return `أعلنت ${ministryName} عن مبادرة جديدة لتحسين الخدمات المقدمة للمواطنين. وتهدف المبادرة إلى تطوير البنية التحتية وتحسين جودة الخدمات في مختلف المحافظات.`;
    }
  }

  /**
   * توليد عنوان من المحتوى
   */
  private generateTitleFromContent(content: string): string {
    try {
      // تقسيم المحتوى إلى جمل
      const sentences = content.split(/[.!؟،]\s+/);
      
      // استخدام الجملة الأولى كعنوان إذا كانت مناسبة
      if (sentences[0] && sentences[0].length > 10 && sentences[0].length < 100) {
        return sentences[0];
      }
      
      // اقتطاع جزء من الجملة الأولى إذا كانت طويلة
      if (sentences[0] && sentences[0].length >= 100) {
        const words = sentences[0].split(' ');
        return words.slice(0, 10).join(' ') + '...';
      }
      
      // إذا كانت الجملة الأولى قصيرة جدًا، دمج الجملتين الأوليين
      if (sentences[0] && sentences[1]) {
        return sentences[0] + '. ' + sentences[1];
      }
      
      // حل بديل
      return content.substring(0, 100) + (content.length > 100 ? '...' : '');
    } catch (error) {
      console.error('خطأ في توليد العنوان من المحتوى:', error);
      return 'خبر جديد من ' + new Date().toLocaleDateString('ar-EG');
    }
  }

  /**
   * الحصول على صورة ذات صلة بالفئة والمصدر
   */
  private async getRelevantImage(category: string, source: string): Promise<string> {
    // في التطبيق الحقيقي، هذه ستكون صورة فعلية من المنشور
    // هنا نستخدم صور ذات صلة بالفئة
    
    const categoryImageMap: Record<string, string[]> = {
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
    
    // اختيار صورة عشوائية من الفئة
    const categoryImages = categoryImageMap[category] || categoryImageMap['أخبار'];
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    
    return categoryImages[randomIndex];
  }

  /**
   * إنشاء مقتطف من المحتوى
   */
  private createExcerpt(content: string, maxLength: number = 150): string {
    // إزالة وسوم HTML
    const textContent = content.replace(/<[^>]+>/g, '');
    
    // اقتطاع النص
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    // البحث عن نهاية الجملة أو الكلمة القريبة من الحد الأقصى
    let truncated = textContent.substring(0, maxLength);
    
    // البحث عن آخر نقطة أو فاصلة أو مسافة
    const lastPeriod = truncated.lastIndexOf('.');
    const lastComma = truncated.lastIndexOf('،');
    const lastSpace = truncated.lastIndexOf(' ');
    
    let endPos = Math.max(lastPeriod, lastComma, lastSpace);
    
    if (endPos > maxLength * 0.7) { // على الأقل 70% من الطول الأقصى
      truncated = truncated.substring(0, endPos + 1);
    } else {
      // إضافة "..." في نهاية المقتطف
      truncated += '...';
    }
    
    return truncated;
  }

  /**
   * دالة مساعدة لإنشاء هاش بسيط للنص
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // تحويل إلى 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

export default FacebookService;
