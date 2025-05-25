
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
  tags?: string[];
  originalSource?: string;
}

interface ArticleContextType {
  articles: Article[];
  featuredArticles: Article[];
  addArticle: (article: Article) => void;
  addBatchArticles: (articles: Article[]) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleById: (id: string) => Article | undefined;
  refreshArticles: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// قائمة فارغة من المقالات
const initialArticles: Article[] = [];

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
        console.error('خطأ في تحميل المقالات من التخزين المحلي:', error);
        // في حالة الخطأ فقط، استخدم قائمة فارغة
        setArticles(initialArticles);
      }
    } else {
      // إذا لم تكن هناك مقالات محفوظة، استخدم قائمة فارغة
      setArticles(initialArticles);
      localStorage.setItem('articles', JSON.stringify(initialArticles));
    }
  }, []);

  // حفظ المقالات في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
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

  const addBatchArticles = (newArticles: Article[]) => {
    const combinedArticles = [...newArticles, ...articles];
    setArticles(combinedArticles);
    localStorage.setItem('articles', JSON.stringify(combinedArticles));
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

  const featuredArticles = articles.filter(article => article.featured);

  const value: ArticleContextType = {
    articles,
    featuredArticles,
    addArticle,
    addBatchArticles,
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
