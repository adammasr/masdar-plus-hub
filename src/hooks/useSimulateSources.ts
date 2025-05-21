
import { Article } from "../context/ArticleContext";
import { reformatArticleWithAI, extractImageFromContent } from "../utils/newsFormatter";

// تاريخ بداية سحب الأخبار (21 مايو 2025)
const startSyncDate = new Date('2025-05-21T00:00:00');

export const useSimulateWebhook = () => {
  // Function to simulate articles from webhook
  const simulateWebhookArticles = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const categories = ["أخبار", "سياسة", "اقتصاد"];
    const mockArticles: Article[] = [];
    
    // Generate 2-5 mock articles
    const articleCount = 2 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < articleCount; i++) {
      const originalTitle = `مقال تجريبي ${i+1} من Webhook`;
      const originalContent = `هذا محتوى تجريبي لمقال تم استيراده عبر Webhook. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الـ webhook.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=Webhook");
      
      mockArticles.push({
        id: `webhook-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date().toISOString().split("T")[0],
        source: "Webhook"
      });
    }
    
    return mockArticles;
  };

  return { simulateWebhookArticles };
};

export const useSimulateGoogleSheet = () => {
  // Function to simulate articles from Google Sheet
  const simulateGoogleSheetArticles = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const categories = ["أخبار", "سياسة", "اقتصاد", "تكنولوجيا"];
    const mockArticles: Article[] = [];
    
    // Generate 3-6 mock articles
    const articleCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < articleCount; i++) {
      const originalTitle = `مقال تجريبي ${i+1} من Google Sheet`;
      const originalContent = `هذا محتوى تجريبي لمقال تم استيراده من Google Sheet. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الجدول.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=Google+Sheet");
      
      mockArticles.push({
        id: `sheet-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date().toISOString().split("T")[0],
        source: "Google Sheets"
      });
    }
    
    return mockArticles;
  };

  return { simulateGoogleSheetArticles };
};

export const useSimulateFacebookArticles = () => {
  // Function to simulate articles from Facebook
  const simulateFacebookArticles = async (pageName: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const categories = ["أخبار", "سياسة"];
    const mockArticles: Article[] = [];
    
    // Generate 1-3 mock articles
    const articleCount = 1 + Math.floor(Math.random() * 3);
    
    // Generate current date for articles (to simulate new content)
    const currentDate = new Date();
    
    for (let i = 0; i < articleCount; i++) {
      // Create a date that's between startSyncDate and current date
      const articleDate = new Date();
      // Randomly set the date to be between startSyncDate and now
      const timeDiff = currentDate.getTime() - startSyncDate.getTime();
      articleDate.setTime(startSyncDate.getTime() + Math.random() * timeDiff);
      
      const originalTitle = `منشور جديد من صفحة ${pageName} - ${i+1}`;
      const originalContent = `هذا محتوى تجريبي لمنشور جديد تم نشره بتاريخ ${articleDate.toLocaleDateString('ar-EG')} من صفحة ${pageName} على فيسبوك. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الصفحة.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=Facebook");
      
      mockArticles.push({
        id: `fb-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: articleDate.toISOString(),
        source: pageName
      });
    }
    
    return mockArticles;
  };

  return { simulateFacebookArticles };
};
