
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RewriteRequest {
  originalText: string;
  category: string;
  source: string;
  tone?: 'formal' | 'casual' | 'neutral';
}

export interface RewriteResponse {
  title: string;
  content: string;
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
- عسكرية
- العالم
- رياضة
- أخبار

المحتوى: "${content.substring(0, 500)}"

اكتب اسم الفئة فقط بدون أي تفسير:
`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const category = response.text().trim();
      
      // التحقق من صحة الفئة
      const validCategories = ['سياسة', 'اقتصاد', 'محافظات', 'ذكاء اصطناعي', 'عسكرية', 'العالم', 'رياضة', 'أخبار'];
      
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
    if (lowerContent.includes('ذكاء اصطناعي') || lowerContent.includes('تكنولوجيا') || lowerContent.includes('ai')) {
      return 'ذكاء اصطناعي';
    }
    if (lowerContent.includes('جيش') || lowerContent.includes('عسكري') || lowerContent.includes('أمن')) {
      return 'عسكرية';
    }
    if (lowerContent.includes('رياضة') || lowerContent.includes('كرة') || lowerContent.includes('أولمبياد')) {
      return 'رياضة';
    }
    if (lowerContent.includes('دولي') || lowerContent.includes('عالمي') || lowerContent.includes('أمريكا')) {
      return 'العالم';
    }
    
    return 'أخبار';
  }

  /**
   * إعادة صياغة المحتوى بطريقة احترافية
   */
  public async rewriteContent(request: RewriteRequest): Promise<RewriteResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = this.buildRewritePrompt(request);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();
      
      let title = '';
      let content = '';

      // Enhanced parsing for "Title: [title]\nContent: [content]"
      // Allows for case-insensitivity and optional whitespace.
      // Matches "Title:" at the beginning of the string, captures the title,
      // then matches "Content:" after a newline, capturing the rest.
      const structuredMatch = rawText.match(/^Title:\s*(.*?)\s*\nContent:\s*(.*)/is);

      if (structuredMatch && structuredMatch[1] && structuredMatch[2]) {
        title = structuredMatch[1].trim();
        content = structuredMatch[2].trim();
        console.log("Successfully parsed structured response.");
      } else {
        // Fallback parsing if the strict structure is not perfectly matched
        // This attempts to find Title: and Content: markers even if not perfectly positioned
        console.warn('Strict parsing failed, attempting flexible fallback parsing.');
        const titleMatchFallback = rawText.match(/Title:\s*(.*?)(?:\nContent:|$)/is);
        const contentMatchFallback = rawText.match(/Content:\s*(.*)/is);

        if (titleMatchFallback && titleMatchFallback[1]) {
          title = titleMatchFallback[1].trim();
        }

        if (contentMatchFallback && contentMatchFallback[1]) {
          content = contentMatchFallback[1].trim();
        }
        
        // Further fallback if parsing still fails to get both title and content
        if (!title && !content) {
          console.warn('Flexible fallback parsing also failed. Using raw text for content and generic title.');
          const firstLine = rawText.split('\n')[0];
          if (rawText.includes('\n') && firstLine.length < 150) { // Use first line as title if reasonable and content exists
              title = firstLine;
              content = rawText.substring(rawText.indexOf('\n') + 1).trim();
          } else { // Otherwise, use generic title and full raw text as content
              title = "خبر معالج بواسطة Gemini"; 
              content = rawText;
          }
        } else if (!title && content) {
          // If only content is found, generate a placeholder title
          title = content.substring(0, Math.min(content.length, 70)) + (content.length > 70 ? "..." : "");
          console.warn('Only content was parsed, title generated from content.');
        } else if (title && !content) {
          // If only title is found, this is unusual. Use placeholder for content.
          content = "محتوى الخبر غير متوفر حالياً أو حدث خطأ في المعالجة.";
          console.warn('Only title was parsed, using placeholder for content.');
        }
      }
      
      return {
        title: this.cleanRewrittenText(title),
        content: this.cleanRewrittenText(content)
      };
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

أعد صياغة هذا الخبر بالكامل. يجب أن يكون الرد بالتنسيق التالي حصراً وبشكل صارم، مع الحفاظ على كافة المتطلبات أعلاه.
لا تضف أي نص قبل "Title:" ولا أي نص بين العنوان و "Content:".

التنسيق المطلوب:
Title: [اكتب هنا عنواناً مباشراً وصريحاً وجذاباً للخبر باللغة العربية، على سبيل المثال: "خلال اجتماعه مع وزير الاتصالات.. الرئيس السيسي يتابع مستجدات مبادرة «الرواد الرقميون»"]
Content: [اكتب هنا محتوى الخبر المعاد صياغته بشكل كامل ومفصل ومنظم في فقرات، مع مقدمة قوية وسياق مصري مناسب. تأكد من أن المحتوى يتبع مباشرة بعد "Content:"]
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
  private enhanceOriginalText(originalText: string, category: string): RewriteResponse {
    // إضافة مقدمة بسيطة حسب الفئة
    const introMap: Record<string, string> = {
      'سياسة': 'في تطور سياسي مهم،',
      'اقتصاد': 'على الصعيد الاقتصادي،',
      'محافظات': 'في إطار أخبار المحافظات،',
      'ذكاء اصطناعي': 'في عالم التكنولوجيا،',
      'عسكرية': 'على الصعيد الأمني،',
      'العالم': 'في التطورات العالمية،',
      'رياضة': 'في الأوساط الرياضية،'
    };
    
    const intro = introMap[category] || 'في آخر التطورات،';
    const enhancedContent = `${intro} ${originalText}

هذا الخبر مقدم من مصدر بلس لتقديم آخر الأخبار المحدثة للقراء الكرام.`;

    // Generate a simple title from the first sentence or a truncated version of the original text
    let title = originalText.split('.')[0]; // Get first sentence
    if (title.length > 70) { // Truncate if too long
      title = title.substring(0, 67) + "...";
    }
    if (!title) {
        title = "خبر عاجل"; // Default title if original text is empty or has no sentence
    }
    
    return {
        title: this.cleanRewrittenText(title),
        content: this.cleanRewrittenText(enhancedContent)
    };
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
