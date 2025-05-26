
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; 
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
  X
} from "lucide-react";

const LOGO_SRC = "/lovable-uploads/2238a7f0-4177-46ef-a6a8-fc8913645906.png";

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth() || {};
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("adminUsername");
    setAdminUsername(username);
  }, []);

  if (!user && !localStorage.getItem("isAdmin")) {
    return null;
  }

  const menuItems = [
    { title: "لوحة التحكم", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { title: "المقالات", path: "/admin/articles", icon: <FileText size={20} /> },
    { title: "إضافة مقال جديد", path: "/admin/articles/new", icon: <PlusCircle size={20} /> },
    { title: "روابط RSS", path: "/admin/rss-feeds", icon: <LinkIcon size={20} /> },
    { title: "الأقسام", path: "/admin/categories", icon: <FolderTree size={20} /> },
    { title: "إدارة الإعلانات", path: "/admin/ads", icon: <BadgeDollarSign size={20} /> },
    { title: "المستخدمين", path: "/admin/users", icon: <UserCog size={20} /> },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* زر فتح القائمة على الموبايل */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-news-accent text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* خلفية شفافة للموبايل */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-200 shadow-lg
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col overflow-hidden
        `}
      >
        {/* رأس الشريط الجانبي */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-news-accent to-red-700">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img
                src={LOGO_SRC}
                alt="ALMASDAR PLUS Logo"
                className="w-8 h-8 rounded object-contain bg-white p-1"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23db1f2d'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-size='6' font-weight='bold'%3E%D8%A7%D9%84%D9%85%D8%B5%D8%AF%D8%B1%3C/text%3E%3C/svg%3E";
                }}
              />
              <span className="font-bold text-white text-lg">المصدر بلس</span>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block text-white hover:bg-white/20 p-1 rounded"
          >
            <Menu size={20} />
          </button>
        </div>
        
        {/* معلومات المستخدم */}
        {adminUsername && !isCollapsed && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">مرحباً بك</div>
            <div className="font-semibold text-news-accent">{adminUsername}</div>
          </div>
        )}

        {/* قائمة التنقل */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all
                    ${isActive(item.path)
                      ? "bg-news-accent text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.title : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span className="flex-1">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="p-2 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2 w-full text-gray-700 hover:text-red-600 
              hover:bg-red-50 rounded-lg transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? "تسجيل الخروج" : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* محتوى الصفحة مع هامش للشريط الجانبي */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}
          min-h-screen bg-gray-50
        `}
      >
        {/* شريط علوي إضافي للوحة التحكم */}
        <div className="bg-white border-b border-gray-200 p-4 md:hidden">
          <h1 className="text-xl font-bold text-news-accent">لوحة التحكم</h1>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
