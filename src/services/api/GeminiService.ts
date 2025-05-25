import axios from 'axios';

// واجهة لتكوين خدمة Gemini
export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

// واجهة لطلب إعادة الصياغة
export interface RewriteRequest {
  originalText: string;
  category?: string;
  source?: string;
  tone?: 'formal' | 'neutral' | 'engaging';
}

/**
 * خدمة للتفاعل مع واجهة برمجة تطبيقات Gemini للذكاء الاصطناعي
 */
export class GeminiService {
  private static instance: GeminiService | null = null;
  private config: GeminiConfig;

  private constructor() {
    // التكوين الافتراضي
    this.config = {
      apiKey: 'AIzaSyAzQEejlpDswE6uoLVWUkUgSh_VNT0FlP0',
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 1024
    };
  }

  /**
   * الحصول على نسخة واحدة من الخدمة (نمط Singleton)
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * تحديث تكوين الخدمة
   */
  public updateConfig(newConfig: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * إعادة صياغة نص باستخدام Gemini
   */
  public async rewriteContent(request: RewriteRequest): Promise<string> {
    try {
      const { originalText, category = 'عام', source = 'غير محدد', tone = 'neutral' } = request;
      
      // بناء موجه للنموذج
      const prompt = this.buildRewritePrompt(originalText, category, source, tone);
      
      // إرسال الطلب إلى واجهة برمجة تطبيقات Gemini
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`,
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
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens,
            topP: 0.9,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.config.apiKey
          }
        }
      );

      // استخراج النص المعاد صياغته من الاستجابة
      const rewrittenText = this.extractRewrittenText(response.data);
      return rewrittenText;
    } catch (error) {
      console.error('خطأ في إعادة صياغة المحتوى:', error);
      // في حالة الفشل، إرجاع النص الأصلي
      return request.originalText;
    }
  }

  /**
   * تصنيف نص الخبر إلى فئة مناسبة
   */
  public async classifyContent(text: string): Promise<string> {
    try {
      const prompt = `
      صنف النص التالي إلى واحدة من الفئات التالية: "سياسة"، "اقتصاد"، "محافظات"، "ذكاء اصطناعي"، "عسكرية"، "العالم"، "أخبار عامة".
      اختر الفئة الأكثر ملاءمة بناءً على محتوى النص.
      
      النص:
      ${text}
      
      الفئة:
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`,
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
            temperature: 0.2,
            maxOutputTokens: 10,
            topP: 0.9,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.config.apiKey
          }
        }
      );

      // استخراج الفئة من الاستجابة
      const category = this.extractCategory(response.data);
      return this.mapCategoryToSystem(category);
    } catch (error) {
      console.error('خطأ في تصنيف المحتوى:', error);
      return 'أخبار';
    }
  }

  /**
   * بناء موجه لإعادة صياغة النص
   */
  private buildRewritePrompt(text: string, category: string, source: string, tone: string): string {
    let toneDescription = '';
    switch (tone) {
      case 'formal':
        toneDescription = 'رسمي ومهني';
        break;
      case 'engaging':
        toneDescription = 'جذاب ومثير للاهتمام';
        break;
      default:
        toneDescription = 'محايد ومتوازن';
    }

    return `
    أعد صياغة النص التالي ليكون خبراً صحفياً بأسلوب ${toneDescription}. 
    حافظ على جميع المعلومات الأساسية والحقائق، مع تحسين الأسلوب والتنظيم.
    تجنب العبارات المكررة والكلمات الزائدة.
    قم بتنظيم النص في فقرات واضحة مع عنوان جذاب.
    الفئة: ${category}
    المصدر: ${source}
    
    النص الأصلي:
    ${text}
    
    النص المعاد صياغته:
    `;
  }

  /**
   * استخراج النص المعاد صياغته من استجابة Gemini
   */
  private extractRewrittenText(response: any): string {
    try {
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text.trim();
      }
      throw new Error('تنسيق استجابة غير متوقع');
    } catch (error) {
      console.error('خطأ في استخراج النص المعاد صياغته:', error);
      return '';
    }
  }

  /**
   * استخراج الفئة من استجابة Gemini
   */
  private extractCategory(response: any): string {
    try {
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text.trim();
      }
      throw new Error('تنسيق استجابة غير متوقع');
    } catch (error) {
      console.error('خطأ في استخراج الفئة:', error);
      return 'أخبار عامة';
    }
  }

  /**
   * تحويل الفئة المستخرجة إلى فئة النظام
   */
  private mapCategoryToSystem(category: string): string {
    const categoryMap: Record<string, string> = {
      'سياسة': 'سياسة',
      'اقتصاد': 'اقتصاد',
      'محافظات': 'محافظات',
      'ذكاء اصطناعي': 'ذكاء اصطناعي',
      'عسكرية': 'عسكرية',
      'العالم': 'العالم',
      'أخبار عامة': 'أخبار'
    };

    // البحث عن تطابق جزئي إذا لم يكن هناك تطابق دقيق
    for (const [key, value] of Object.entries(categoryMap)) {
      if (category.includes(key)) {
        return value;
      }
    }

    return 'أخبار';
  }
}

export default GeminiService;
