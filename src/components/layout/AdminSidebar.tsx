
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
  BadgeDollarSign
} from "lucide-react";

// استخدام نفس اللوجو المحدث
const LOGO_SRC = "/lovable-uploads/2238a7f0-4177-46ef-a6a8-fc8913645906.png";

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth() || {};
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  useEffect(() => {
    // استرجاع اسم المستخدم من التخزين المحلي
    const username = localStorage.getItem("adminUsername");
    setAdminUsername(username);
  }, []);

  // التحقق من وجود المستخدم وأن دوره "admin" أو لديه صلاحية الوصول للإدارة
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
    <aside
      className="
        bg-gradient-to-bl from-white via-[#f6f6fb] to-[#f3f4fa]
        border-l border-news-accent/10 w-64 fixed top-0 left-0 h-full
        z-40 shadow-xl shadow-news-accent/5
        hidden md:flex flex-col
        overflow-y-auto
      "
      style={{
        backdropFilter: "blur(1.5px)",
        marginTop: "140px", // تعديل المسافة العلوية لتجنب التداخل مع الهيدر
      }}
    >
      {/* اللوجو والعنوان */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-2 mb-3 border-b border-gray-200/60">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo"
          className="w-10 h-10 rounded-lg shadow border-2 border-white bg-white object-contain"
          onError={(e) => {
            console.log('Admin sidebar logo failed to load');
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23db1f2d'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='8' font-weight='bold'%3E%D8%A7%D9%84%D9%85%D8%B5%D8%AF%D8%B1%3C/text%3E%3C/svg%3E";
          }}
        />
        <span className="font-black text-lg text-news-accent tracking-wide drop-shadow-sm select-none">
          المصدر بلس
        </span>
      </div>
      
      {/* معلومات المستخدم */}
      {adminUsername && (
        <div className="px-6 py-3 mb-2 border-b border-gray-200/60">
          <div className="text-sm text-gray-700">مرحباً بك</div>
          <div className="font-semibold text-news-accent">{adminUsername}</div>
        </div>
      )}

      <nav className="flex-1 px-4 py-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all
                  ${
                    isActive(item.path)
                      ? "bg-news-accent text-white shadow-md shadow-news-accent/20 scale-[1.03] border-r-4 border-white"
                      : "text-gray-700 hover:bg-[#f9d7dc] hover:text-news-accent/90"
                  }
                  focus:outline-none focus:ring-2 focus:ring-news-accent/10
                  whitespace-nowrap
                `}
                tabIndex={0}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* زر تسجيل الخروج */}
      <div className="px-4 py-4 mt-auto border-t border-gray-200/60">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-gray-700 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>

      {/* زخرفة شفافة أسفل الشريط */}
      <div className="mt-2 flex justify-center items-end pb-6 opacity-20 pointer-events-none select-none">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo Decorative"
          className="w-28 h-16 object-contain"
          style={{ filter: "blur(0.5px)" }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </aside>
  );
};

export default AdminSidebar;
