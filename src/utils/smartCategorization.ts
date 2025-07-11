// نظام تصنيف ذكي للأخبار

export interface CategoryRule {
  category: string;
  keywords: string[];
  priority: number;
  contextKeywords?: string[];
}

// قواعد التصنيف الذكي
export const categorizationRules: CategoryRule[] = [
  // السياسة
  {
    category: 'سياسة',
    keywords: ['الرئيس', 'الحكومة', 'الوزراء', 'البرلمان', 'السيسي', 'مدبولي', 'قرار جمهوري', 'مجلس الوزراء', 'دبلوماسية', 'سياسة خارجية'],
    priority: 10,
    contextKeywords: ['قانون', 'تشريع', 'انتخابات', 'حزب']
  },
  
  // الاقتصاد
  {
    category: 'اقتصاد',
    keywords: ['البنك المركزي', 'الجنيه', 'استثمار', 'بورصة', 'تضخم', 'اقتصاد', 'مالية', 'ضرائب', 'شركات', 'تجارة'],
    priority: 9,
    contextKeywords: ['سعر الصرف', 'ميزانية', 'قروض', 'صندوق النقد']
  },
  
  // المحافظات
  {
    category: 'محافظات',
    keywords: ['محافظ', 'محافظة', 'القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان', 'الأقصر', 'الشرقية', 'المنوفية', 'القليوبية'],
    priority: 8,
    contextKeywords: ['تنمية محلية', 'خدمات', 'مشروعات', 'بنية تحتية']
  },
  
  // التكنولوجيا والذكاء الاصطناعي
  {
    category: 'تكنولوجيا',
    keywords: ['ذكاء اصطناعي', 'تكنولوجيا', 'رقمي', 'إنترنت', 'تطبيق', 'برمجة', 'حاسوب', 'شبكة'],
    priority: 7,
    contextKeywords: ['تطوير', 'ابتكار', 'منصة رقمية', 'تحول رقمي']
  },
  
  // العسكرية والأمن
  {
    category: 'عسكرية',
    keywords: ['الجيش', 'القوات المسلحة', 'الدفاع', 'أمن قومي', 'عسكري', 'حدود', 'عملية أمنية'],
    priority: 8,
    contextKeywords: ['مناورات', 'تدريبات', 'معدات عسكرية']
  },
  
  // الرياضة
  {
    category: 'رياضة',
    keywords: ['كرة القدم', 'الأهلي', 'الزمالك', 'منتخب', 'مباراة', 'بطولة', 'رياضة', 'لاعب'],
    priority: 6,
    contextKeywords: ['فوز', 'هزيمة', 'تعادل', 'دوري']
  },
  
  // التعليم
  {
    category: 'تعليم',
    keywords: ['التعليم', 'المدارس', 'الجامعات', 'طلاب', 'امتحانات', 'مناهج', 'وزارة التعليم'],
    priority: 7,
    contextKeywords: ['دراسة', 'تطوير تعليمي', 'مناهج جديدة']
  },
  
  // الصحة
  {
    category: 'صحة',
    keywords: ['وزارة الصحة', 'مستشفى', 'طب', 'علاج', 'فيروس', 'وباء', 'صحة'],
    priority: 8,
    contextKeywords: ['طبي', 'دواء', 'لقاح', 'مرض']
  },
  
  // حوادث وجرائم
  {
    category: 'حوادث',
    keywords: ['حادث', 'جريمة', 'الداخلية', 'شرطة', 'حريق', 'انفجار', 'وفاة'],
    priority: 9,
    contextKeywords: ['تحقيق', 'قضائي', 'محكمة']
  },
  
  // العالم
  {
    category: 'العالم',
    keywords: ['دولي', 'عالمي', 'أمريكا', 'أوروبا', 'آسيا', 'أفريقيا', 'الأمم المتحدة', 'عربي'],
    priority: 5,
    contextKeywords: ['خارجي', 'دبلوماسي', 'اتفاقية دولية']
  }
];

// الكلمات المحظورة التي تشير إلى محتوى إعلاني أو غير مناسب
export const excludedKeywords = [
  'ONLY AVAILABLE IN PAID PLANS',
  'إعلان',
  'اشترك الآن',
  'عرض خاص',
  'خصم',
  'للبيع',
  'متوفر الآن'
];

export function categorizeArticle(title: string, content: string, excerpt?: string): string {
  const fullText = `${title} ${content} ${excerpt || ''}`.toLowerCase();
  
  // التحقق من الكلمات المحظورة
  if (excludedKeywords.some(keyword => fullText.includes(keyword.toLowerCase()))) {
    return 'غير مصنف'; // أو يمكن تجاهل المقال تماماً
  }
  
  let bestMatch = { category: 'أخبار', score: 0 };
  
  for (const rule of categorizationRules) {
    let score = 0;
    
    // حساب النقاط بناءً على الكلمات المفتاحية الأساسية
    for (const keyword of rule.keywords) {
      const keywordCount = (fullText.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      score += keywordCount * rule.priority;
    }
    
    // إضافة نقاط إضافية للكلمات السياقية
    if (rule.contextKeywords) {
      for (const contextKeyword of rule.contextKeywords) {
        const contextCount = (fullText.match(new RegExp(contextKeyword.toLowerCase(), 'g')) || []).length;
        score += contextCount * (rule.priority * 0.5);
      }
    }
    
    // تحديث أفضل تطابق
    if (score > bestMatch.score) {
      bestMatch = { category: rule.category, score };
    }
  }
  
  // إذا كانت النقاط منخفضة جداً، يبقى في فئة "أخبار"
  return bestMatch.score > 0 ? bestMatch.category : 'أخبار';
}

// دالة لتحسين الصور المستخرجة
export function improveImageExtraction(article: any): string {
  // إذا كانت هناك صورة موجودة ومناسبة، استخدمها
  if (article.image && !article.image.includes('placeholder') && !article.image.includes('example')) {
    return article.image;
  }
  
  // صور افتراضية حسب الفئة
  const categoryImages: Record<string, string> = {
    'سياسة': 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=400',
    'اقتصاد': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
    'محافظات': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=400',
    'تكنولوجيا': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    'عسكرية': 'https://images.unsplash.com/photo-1541532213-558e2bbd4d15?w=400',
    'رياضة': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    'تعليم': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    'صحة': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    'حوادث': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
    'العالم': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400'
  };
  
  return categoryImages[article.category] || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400';
}

export default {
  categorizeArticle,
  improveImageExtraction,
  categorizationRules,
  excludedKeywords
};