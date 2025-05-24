
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  featured?: boolean;
  videoUrl?: string;
  source?: string;
  isTranslated?: boolean;
  readingTime?: number;
}

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleById: (id: string) => Article | undefined;
  refreshArticles: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

const initialArticles: Article[] = [
  {
    id: "1",
    title: "أخبار عاجلة من المنطقة",
    content: "تفاصيل شاملة للأحداث الجارية في المنطقة مع تغطية مباشرة للتطورات الأخيرة. يشهد الوضع تطورات مهمة تستدعي المتابعة الدقيقة من قبل المراقبين والمحللين السياسيين في المنطقة.",
    excerpt: "تغطية شاملة للأحداث الجارية والتطورات الأخيرة",
    image: "https://picsum.photos/600/400?random=1",
    category: "أخبار",
    date: new Date().toISOString().split('T')[0],
    featured: true,
    source: "وكالات الأنباء",
    readingTime: 3
  },
  {
    id: "2",
    title: "تطورات اقتصادية مهمة",
    content: "تحليل مفصل للوضع الاقتصادي الراهن مع استعراض أهم المؤشرات والبيانات الاقتصادية التي تؤثر على الأسواق المحلية والعالمية. يركز التقرير على التحديات والفرص المتاحة.",
    excerpt: "تحليل شامل للمؤشرات الاقتصادية والتوقعات المستقبلية",
    image: "https://picsum.photos/600/400?random=2",
    category: "اقتصاد",
    date: new Date().toISOString().split('T')[0],
    featured: false,
    source: "محللون اقتصاديون",
    readingTime: 5
  },
  {
    id: "3",
    title: "فيديو: لقاء حصري مع خبير سياسي",
    content: "مقابلة شاملة مع خبير في الشؤون السياسية يناقش فيها أهم التطورات السياسية الإقليمية والدولية وتأثيرها على المنطقة. اللقاء يتضمن تحليلات عميقة ورؤى استراتيجية.",
    excerpt: "لقاء حصري يناقش التطورات السياسية الإقليمية",
    image: "https://picsum.photos/600/400?random=3",
    category: "فيديوهات",
    date: new Date().toISOString().split('T')[0],
    featured: true,
    videoUrl: "https://www.youtube.com/watch?v=example",
    source: "قناة الأخبار",
    readingTime: 7
  }
];

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  // تحميل المقالات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        setArticles(parsedArticles);
      } catch (error) {
        console.error('خطأ في تحميل المقالات:', error);
        setArticles(initialArticles);
        localStorage.setItem('articles', JSON.stringify(initialArticles));
      }
    } else {
      setArticles(initialArticles);
      localStorage.setItem('articles', JSON.stringify(initialArticles));
    }
  }, []);

  // حفظ المقالات في localStorage عند كل تغيير
  useEffect(() => {
    if (articles.length > 0) {
      localStorage.setItem('articles', JSON.stringify(articles));
    }
  }, [articles]);

  // الاستماع لأحداث التحديث الخارجية
  useEffect(() => {
    const handleStorageChange = () => {
      const savedArticles = localStorage.getItem('articles');
      if (savedArticles) {
        try {
          const parsedArticles = JSON.parse(savedArticles);
          setArticles(parsedArticles);
        } catch (error) {
          console.error('خطأ في تحديث المقالات:', error);
        }
      }
    };

    const handleArticlesUpdate = () => {
      handleStorageChange();
    };

    // الاستماع لتغييرات localStorage
    window.addEventListener('storage', handleStorageChange);
    // الاستماع لأحداث التحديث المخصصة
    window.addEventListener('articlesUpdated', handleArticlesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, []);

  const addArticle = (article: Article) => {
    const newArticles = [article, ...articles];
    setArticles(newArticles);
    localStorage.setItem('articles', JSON.stringify(newArticles));
  };

  const updateArticle = (id: string, updatedArticle: Partial<Article>) => {
    const newArticles = articles.map(article => 
      article.id === id ? { ...article, ...updatedArticle } : article
    );
    setArticles(newArticles);
    localStorage.setItem('articles', JSON.stringify(newArticles));
  };

  const deleteArticle = (id: string) => {
    const newArticles = articles.filter(article => article.id !== id);
    setArticles(newArticles);
    localStorage.setItem('articles', JSON.stringify(newArticles));
  };

  const getArticleById = (id: string): Article | undefined => {
    return articles.find(article => article.id === id);
  };

  const refreshArticles = () => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        setArticles(parsedArticles);
      } catch (error) {
        console.error('خطأ في تحديث المقالات:', error);
      }
    }
  };

  const value: ArticleContextType = {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleById,
    refreshArticles
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};
