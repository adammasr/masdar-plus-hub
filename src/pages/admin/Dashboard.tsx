import { useArticles } from "../context/ArticleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WebhookSetup from "../../components/admin/WebhookSetup";
import FacebookSection from "../../components/admin/facebook/FacebookSection";
import AutoSyncStatus from "../../components/admin/AutoSyncStatus";
import { Link } from "react-router-dom";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  Eye, 
  Star, 
  Play, 
  Globe,
  PlusCircle,
  Settings,
  BarChart3
} from "lucide-react";

const Dashboard = () => {
  const { articles } = useArticles();

  // Count articles by category
  const categoryCounts: Record<string, number> = {};
  articles.forEach(article => {
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
  });

  // Recent articles (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentArticles = articles.filter(article => 
    new Date(article.date) >= weekAgo
  );

  const quickActions = [
    {
      title: "إضافة مقال جديد",
      description: "إنشاء مقال جديد",
      icon: <PlusCircle size={20} />,
      link: "/admin/articles/new",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "إدارة المقالات",
      description: "عرض وتحرير المقالات",
      icon: <FileText size={20} />,
      link: "/admin/articles",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "إدارة الإعلانات",
      description: "إضافة وتعديل الإعلانات",
      icon: <BarChart3 size={20} />,
      link: "/admin/ads",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "إعدادات RSS",
      description: "إدارة مصادر الأخبار",
      icon: <Settings size={20} />,
      link: "/admin/rss-feeds",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
        </div>
      </div>
      
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FileText size={16} />
              إجمالي المقالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{articles.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              +{recentArticles.length} هذا الأسبوع
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Star size={16} />
              المقالات المميزة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {articles.filter(a => a.featured).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">من إجمالي المقالات</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Play size={16} />
              الفيديوهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {articles.filter(a => a.videoUrl).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">مقال بفيديو</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Globe size={16} />
              مصادر خارجية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {articles.filter(a => a.source && a.source !== "محرر يدويًا").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">من مصادر RSS وفيسبوك</p>
          </CardContent>
        </Card>
      </div>

      {/* الإجراءات السريعة */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className={`${action.color} text-white p-3 rounded-lg mb-3 w-fit`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات الأقسام */}
      <Card>
        <CardHeader>
          <CardTitle>توزيع المقالات حسب الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* مكون حالة المزامنة التلقائية */}
      <AutoSyncStatus />
      
      <h2 className="text-2xl font-bold mt-8">استيراد المقالات</h2>
      <WebhookSetup />
      
      {/* قسم صفحات فيسبوك */}
      <FacebookSection />

      <Card>
        <CardHeader>
          <CardTitle>آخر المقالات المضافة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">العنوان</th>
                  <th className="px-6 py-3">القسم</th>
                  <th className="px-6 py-3">التاريخ</th>
                  <th className="px-6 py-3">المصدر</th>
                  <th className="px-6 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {articles.slice(0, 5).map((article) => (
                  <tr key={article.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium max-w-xs">
                      <div className="truncate" title={article.title}>
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{article.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600">
                        {article.source || "محرر يدويًا"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {article.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            مميز
                          </span>
                        )}
                        {article.videoUrl && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            فيديو
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
