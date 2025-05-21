
import { createContext, useState, useContext, ReactNode } from "react";

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  source?: string;
  featured?: boolean;
  videoUrl?: string;
}

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  featuredArticles: Article[];
  addBatchArticles: (articles: Article[]) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Sample initial data
const initialArticles: Article[] = [
  {
    id: "1",
    title: "الرئيس المصري يفتتح عددًا من المشروعات القومية الجديدة",
    content: "افتتح الرئيس المصري اليوم عددًا من المشروعات القومية الكبرى في محافظات مختلفة، بتكلفة إجمالية تبلغ مليارات الجنيهات. وأكد الرئيس خلال الافتتاح على أهمية هذه المشروعات في دعم الاقتصاد المصري وتوفير فرص عمل جديدة للشباب...",
    excerpt: "افتتح الرئيس المصري اليوم عددًا من المشروعات القومية الكبرى في محافظات مختلفة...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "سياسة",
    date: "2023-05-20",
    featured: true
  },
  {
    id: "2",
    title: "وزارة المالية تعلن موازنة العام المالي الجديد",
    content: "أعلنت وزارة المالية المصرية اليوم عن موازنة العام المالي الجديد، والتي تستهدف خفض عجز الموازنة إلى نسبة 6.5% من الناتج المحلي الإجمالي. وتتضمن الموازنة الجديدة زيادة الإنفاق على الصحة والتعليم...",
    excerpt: "أعلنت وزارة المالية المصرية اليوم عن موازنة العام المالي الجديد...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "اقتصاد",
    date: "2023-05-19"
  },
  {
    id: "3",
    title: "وزير الخارجية يبحث مع نظيره الألماني العلاقات الثنائية",
    content: "استقبل وزير الخارجية المصري اليوم نظيره الألماني في القاهرة، وبحث معه سبل تعزيز العلاقات الثنائية بين البلدين في مختلف المجالات. كما ناقش الوزيران عددًا من القضايا الإقليمية والدولية ذات الاهتمام المشترك...",
    excerpt: "استقبل وزير الخارجية المصري اليوم نظيره الألماني في القاهرة، وبحث معه سبل تعزيز العلاقات...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "سياسة",
    date: "2023-05-18",
    featured: true
  },
  {
    id: "4",
    title: "البورصة المصرية تسجل ارتفاعًا ملحوظًا في ختام تعاملات اليوم",
    content: "سجلت مؤشرات البورصة المصرية ارتفاعًا ملحوظًا في ختام تعاملات اليوم، وسط تحسن أداء الأسهم القيادية في قطاعات البنوك والاتصالات والعقارات. وأظهرت بيانات التداول ارتفاع المؤشر الرئيسي EGX30 بنسبة 1.5%...",
    excerpt: "سجلت مؤشرات البورصة المصرية ارتفاعًا ملحوظًا في ختام تعاملات اليوم...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "اقتصاد",
    date: "2023-05-17"
  },
  {
    id: "5",
    title: "تعرف على آخر تطورات مشروع القطار الكهربائي السريع",
    content: "كشفت وزارة النقل المصرية عن آخر تطورات مشروع القطار الكهربائي السريع، والذي يعد أحد أهم مشروعات البنية التحتية في مصر. وأوضحت الوزارة أن نسبة الإنجاز في المشروع تجاوزت 60%، وأن العمل يسير وفق الجدول الزمني المحدد...",
    excerpt: "كشفت وزارة النقل المصرية عن آخر تطورات مشروع القطار الكهربائي السريع...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "أخبار",
    date: "2023-05-16",
    featured: true
  },
  {
    id: "6",
    title: "وزير التربية والتعليم يعلن موعد انطلاق امتحانات الثانوية العامة",
    content: "أعلن وزير التربية والتعليم المصري اليوم موعد انطلاق امتحانات الثانوية العامة للعام الدراسي الحالي. وأكد الوزير أن الوزارة أنهت كافة الاستعدادات اللازمة لبدء الامتحانات، مشددًا على اتخاذ كافة الإجراءات لضمان سير الامتحانات بنزاهة وشفافية...",
    excerpt: "أعلن وزير التربية والتعليم المصري اليوم موعد انطلاق امتحانات الثانوية العامة للعام الدراسي الحالي...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "أخبار",
    date: "2023-05-15"
  },
  {
    id: "7",
    title: "الحكومة تقر حزمة من الإجراءات لدعم الصناعة المحلية",
    content: "أقرت الحكومة المصرية حزمة من الإجراءات والتسهيلات الجديدة لدعم الصناعة المحلية وتشجيع الاستثمار في القطاع الصناعي. وتشمل هذه الإجراءات تخفيض أسعار الطاقة للمصانع، وتيسير إجراءات الحصول على التراخيص الصناعية...",
    excerpt: "أقرت الحكومة المصرية حزمة من الإجراءات والتسهيلات الجديدة لدعم الصناعة المحلية...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "اقتصاد",
    date: "2023-05-14",
    featured: true
  },
  {
    id: "8",
    title: "شاهد أبرز لقطات مباراة الأهلي والزمالك في الدوري المصري",
    content: "انتهت مباراة القمة بين الأهلي والزمالك في الدوري المصري بالتعادل الإيجابي بهدف لكل فريق. وشهدت المباراة العديد من اللقطات المثيرة والأهداف الجميلة التي أضفت إثارة كبيرة على أجواء اللقاء...",
    excerpt: "انتهت مباراة القمة بين الأهلي والزمالك في الدوري المصري بالتعادل الإيجابي...",
    image: "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس",
    category: "فيديوهات",
    date: "2023-05-13",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
];

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const addArticle = (article: Article) => {
    setArticles((prevArticles) => [...prevArticles, article]);
  };

  const updateArticle = (id: string, updatedArticle: Partial<Article>) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, ...updatedArticle } : article
      )
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id)
    );
  };

  const addBatchArticles = (newArticles: Article[]) => {
    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
  };

  const featuredArticles = articles.filter((article) => article.featured);

  return (
    <ArticleContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        featuredArticles,
        addBatchArticles
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticleProvider");
  }
  return context;
};
