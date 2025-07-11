import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Link as LinkIcon, 
  FolderTree, 
  UserCog,
  LogOut,
  BadgeDollarSign,
  Menu,
  X,
  Bell,
  Settings,
  TrendingUp
} from "lucide-react";

const LOGO_SRC = "/lovable-uploads/2238a7f0-4177-46ef-a6a8-fc8913645906.png";

interface ImprovedAdminLayoutProps {
  children: ReactNode;
}

const ImprovedAdminLayout = ({ children }: ImprovedAdminLayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { title: "لوحة التحكم", path: "/admin", icon: <LayoutDashboard size={20} />, color: "bg-blue-500" },
    { title: "المقالات", path: "/admin/articles", icon: <FileText size={20} />, color: "bg-green-500" },
    { title: "إضافة مقال جديد", path: "/admin/articles/new", icon: <PlusCircle size={20} />, color: "bg-purple-500" },
    { title: "روابط RSS", path: "/admin/rss-feeds", icon: <LinkIcon size={20} />, color: "bg-orange-500" },
    { title: "الأقسام", path: "/admin/categories", icon: <FolderTree size={20} />, color: "bg-teal-500" },
    { title: "إدارة الإعلانات", path: "/admin/ads", icon: <BadgeDollarSign size={20} />, color: "bg-yellow-500" },
    { title: "المستخدمين", path: "/admin/users", icon: <UserCog size={20} />, color: "bg-indigo-500" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط علوي محسن ثابت */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          {/* شعار الموقع */}
          <div className="flex items-center gap-3">
            <img
              src={LOGO_SRC}
              alt="ALMASDAR PLUS Logo"
              className="w-8 h-8 rounded object-contain"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23db1f2d'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-size='6' font-weight='bold'%3E%D8%A7%D9%84%D9%85%D8%B5%D8%AF%D8%B1%3C/text%3E%3C/svg%3E";
              }}
            />
            <h1 className="text-xl font-bold text-news-accent">لوحة التحكم - المصدر بلس</h1>
          </div>

          {/* أدوات التحكم */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-news-accent">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <Link 
              to="/"
              className="px-4 py-2 text-sm text-gray-600 hover:text-news-accent transition-colors"
            >
              زيارة الموقع
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* قائمة تنقل أفقية محسنة */}
      <nav className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-news-accent to-red-700 text-white shadow-lg">
        <div className="flex items-center justify-start px-6 py-3 overflow-x-auto">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap mr-2
                ${isActive(item.path)
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className={`p-1 rounded ${item.color} text-white`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="pt-32 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {children}
        </div>
      </main>

      {/* تذييل */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          © 2024 المصدر بلس - جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
};

export default ImprovedAdminLayout;