import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RewriteRequest {
  originalText: string;
  category: string;
  source: string;
  tone?: 'formal' | 'casual' | 'neutral';
}

/**
 * خدمة Gemini AI المحسنة لإعادة صياغة الأخبار
 */
export class GeminiService {
  private static instance: GeminiService | null = null;
  private genAI: GoogleGenerativeAI;
  private apiKey: string = 'AIzaSyAzQEejlpDswE6uoLVWUkUgSh_VNT0FlP0';

  private constructor() {
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * تحديث تكوين الخدمة
   */
  public updateConfig(config: { apiKey?: string }): void {
    if (config.apiKey) {
      this.apiKey = config.apiKey;
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * تصنيف المحتوى إلى فئات
   */
  public async classifyContent(content: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
حدد الفئة الأنسب لهذا المحتوى الإخباري من الفئات التالية:
- سياسة
- اقتصاد  
- محافظات
- ذكاء اصطناعي
- تكنولوجيا
- عسكرية
- العالم
- رياضة
- فن وثقافة
- سيارات
- علوم
- جامعات وتعليم
- حوادث
- أخبار

المحتوى: "${content.substring(0, 500)}"

اكتب اسم الفئة فقط بدون أي تفسير:
`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const category = response.text().trim();
      
      // التحقق من صحة الفئة
      const validCategories = ['سياسة', 'اقتصاد', 'محافظات', 'ذكاء اصطناعي', 'تكنولوجيا', 'عسكرية', 'العالم', 'رياضة', 'فن وثقافة', 'سيارات', 'علوم', 'جامعات وتعليم', 'حوادث', 'أخبار'];
      
      if (validCategories.includes(category)) {
        return category;
      }
      
      // تصنيف افتراضي بناءً على الكلمات المفتاحية
      return this.classifyByKeywords(content);
    } catch (error) {
      console.error('خطأ في تصنيف المحتوى:', error);
      return this.classifyByKeywords(content);
    }
  }

  /**
   * تصنيف بناءً على الكلمات المفتاحية
   */
  private classifyByKeywords(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('وزير') || lowerContent.includes('حكومة') || lowerContent.includes('رئيس')) {
      return 'سياسة';
    }
    if (lowerContent.includes('اقتصاد') || lowerContent.includes('استثمار') || lowerContent.includes('بورصة')) {
      return 'اقتصاد';
    }
    if (lowerContent.includes('محافظة') || lowerContent.includes('المنوفية') || lowerContent.includes('القاهرة')) {
      return 'محافظات';
    }
    if (lowerContent.includes('ذكاء اصطناعي') || lowerContent.includes('ai') || lowerContent.includes('machine learning')) {
      return 'ذكاء اصطناعي';
    }
    if (lowerContent.includes('تكنولوجيا') || lowerContent.includes('تقني') || lowerContent.includes('إنترنت') || lowerContent.includes('كمبيوتر')) {
      return 'تكنولوجيا';
    }
    if (lowerContent.includes('جيش') || lowerContent.includes('عسكري') || lowerContent.includes('أمن')) {
      return 'عسكرية';
    }
    if (lowerContent.includes('رياضة') || lowerContent.includes('كرة') || lowerContent.includes('أولمبياد') || lowerContent.includes('مباراة')) {
      return 'رياضة';
    }
    if (lowerContent.includes('فن') || lowerContent.includes('ثقافة') || lowerContent.includes('مسرح') || lowerContent.includes('سينما') || lowerContent.includes('موسيق')) {
      return 'فن وثقافة';
    }
    if (lowerContent.includes('سيارة') || lowerContent.includes('سيارات') || lowerContent.includes('محرك') || lowerContent.includes('مركبة')) {
      return 'سيارات';
    }
    if (lowerContent.includes('علم') || lowerContent.includes('بحث') || lowerContent.includes('اكتشاف') || lowerContent.includes('دراسة')) {
      return 'علوم';
    }
    if (lowerContent.includes('جامعة') || lowerContent.includes('طلاب') || lowerContent.includes('تعليم') || lowerContent.includes('مدرسة')) {
      return 'جامعات وتعليم';
    }
    if (lowerContent.includes('حادث') || lowerContent.includes('إصابة') || lowerContent.includes('وفاة') || lowerContent.includes('طوارئ')) {
      return 'حوادث';
    }
    if (lowerContent.includes('دولي') || lowerContent.includes('عالمي') || lowerContent.includes('أمريكا')) {
      return 'العالم';
    }
    
    return 'أخبار';
  }

  /**
   * إعادة صياغة المحتوى بطريقة احترافية
   */
  public async rewriteContent(request: RewriteRequest): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = this.buildRewritePrompt(request);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rewrittenText = response.text();
      
      // تنظيف النص المُعاد صياغته
      return this.cleanRewrittenText(rewrittenText);
    } catch (error) {
      console.error('خطأ في إعادة الصياغة:', error);
      // في حالة الفشل، إرجاع نص محسن بدلاً من النص الأصلي
      return this.enhanceOriginalText(request.originalText, request.category);
    }
  }

  /**
   * بناء prompt محسن لإعادة الصياغة
   */
  private buildRewritePrompt(request: RewriteRequest): string {
    const categoryContext = this.getCategoryContext(request.category);
    const toneInstructions = this.getToneInstructions(request.tone || 'neutral');
    
    return `
أنت محرر أخبار محترف في موقع "مصدر بلس" الإخباري المصري. مهمتك هي إعادة صياغة الخبر التالي بطريقة احترافية وجذابة.

المتطلبات:
- اكتب بالعربية الفصحى
- حافظ على جميع الحقائق والأرقام الأصلية
- اجعل العنوان جذاباً ومناسباً للقراء المصريين
- ${categoryContext}
- ${toneInstructions}
- اكتب مقدمة قوية تجذب القارئ
- نظم المحتوى في فقرات واضحة ومترابطة
- أضف سياق مناسب للقراء المصريين
- تجنب التكرار والحشو

النص الأصلي:
"${request.originalText}"

المصدر: ${request.source}
الفئة: ${request.category}

أعد صياغة هذا الخبر بطريقة احترافية، مع الحفاظ على المعلومات الأساسية وجعله أكثر جاذبية للقراء:
`;
  }

  /**
   * الحصول على سياق الفئة
   */
  private getCategoryContext(category: string): string {
    const contextMap: Record<string, string> = {
      'سياسة': 'ركز على التأثيرات السياسية والقرارات الحكومية المهمة للمواطن المصري',
      'اقتصاد': 'اشرح التأثيرات الاقتصادية على المواطن العادي والأسواق المصرية',
      'محافظات': 'ركز على تأثير الخبر على المواطنين في المحافظات المختلفة',
      'ذكاء اصطناعي': 'اربط التطورات التقنية بالواقع المصري وفرص المستقبل',
      'عسكرية': 'ركز على الأمن القومي والاستقرار في المنطقة',
      'العالم': 'اربط الأحداث العالمية بتأثيرها على مصر والمنطقة العربية',
      'رياضة': 'ركز على الإنجازات الرياضية والفرق المصرية'
    };
    
    return contextMap[category] || 'اكتب بطريقة تناسب الجمهور المصري العام';
  }

  /**
   * تعليمات النبرة
   */
  private getToneInstructions(tone: string): string {
    const toneMap: Record<string, string> = {
      'formal': 'استخدم نبرة رسمية ومهنية مناسبة للأخبار الجادة',
      'casual': 'استخدم نبرة ودودة وقريبة من القارئ العادي',
      'neutral': 'استخدم نبرة متوازنة بين الرسمية والود'
    };
    
    return toneMap[tone] || toneMap['neutral'];
  }

  /**
   * تنظيف النص المُعاد صياغته
   */
  private cleanRewrittenText(text: string): string {
    return text
      .replace(/\*\*/g, '') // إزالة التنسيق الزائد
      .replace(/#+\s*/g, '') // إزالة عناوين markdown
      .replace(/^\s*[\-\*]\s*/gm, '') // إزالة نقاط القوائم
      .replace(/\n{3,}/g, '\n\n') // تقليل الأسطر الفارغة
      .trim();
  }

  /**
   * تحسين النص الأصلي في حالة فشل إعادة الصياغة
   */
  private enhanceOriginalText(originalText: string, category: string): string {
    // إضافة مقدمة بسيطة حسب الفئة
    const introMap: Record<string, string> = {
      'سياسة': 'في تطور سياسي مهم,',
      'اقتصاد': 'على الصعيد الاقتصادي,',
      'محافظات': 'في إطار أخبار المحافظات,',
      'ذكاء اصطناعي': 'في عالم التكنولوجيا,',
      'عسكرية': 'على الصعيد الأمني,',
      'العالم': 'في التطورات العالمية,',
      'رياضة': 'في الأوساط الرياضية,'
    };
    
    const intro = introMap[category] || 'في آخر التطورات,';
    
    return `${intro} ${originalText}

هذا الخبر مقدم من مصدر بلس لتقديم آخر الأخبار المحدثة للقراء الكرام.`;
  }

  /**
   * إنشاء عنوان محسن
   */
  public async generateTitle(content: string, category: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
اكتب عنواناً جذاباً وقصيراً (أقل من 80 حرف) لهذا الخبر:

الفئة: ${category}
المحتوى: ${content.substring(0, 300)}

العنوان يجب أن يكون:
- باللغة العربية
- جذاب ومثير للاهتمام
- واضح ومباشر
- يلخص الخبر بدقة
- مناسب للقراء المصريين

العنوان فقط:
`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim().replace(/"/g, '');
    } catch (error) {
      console.error('خطأ في إنشاء العنوان:', error);
      return content.substring(0, 60) + '...';
    }
  }
}

export default GeminiService;
