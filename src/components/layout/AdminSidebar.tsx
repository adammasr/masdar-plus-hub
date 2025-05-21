import { Link, useLocation } from "react-router-dom";
// استيراد السياق الخاص بالمصادقة أو المستخدم (عدّل المسار حسب مشروعك)
import { useAuth } from "../../context/AuthContext"; 

const LOGO_SRC = "/logo.png";

const AdminSidebar = () => {
  const location = useLocation();
  // نفترض أن useAuth() يرجع كائن فيه user وصلاحياته
  const { user } = useAuth() || {};

  // تحقق من وجود المستخدم وأن دوره "admin" أو لديه صلاحية الوصول للإدارة
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    // يمكنك هنا توجيه المستخدم للصفحة الرئيسية أو صفحة تسجيل الدخول إذا لزم الأمر
    return null;
  }

  const menuItems = [
    { title: "لوحة التحكم", path: "/admin", icon: "🏠" },
    { title: "المقالات", path: "/admin/articles", icon: "📰" },
    { title: "إضافة مقال جديد", path: "/admin/articles/new", icon: "➕" },
    { title: "روابط RSS", path: "/admin/rss-feeds", icon: "🔗" },
    { title: "الأقسام", path: "/admin/categories", icon: "📂" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className="
        bg-gradient-to-bl from-white via-[#f6f6fb] to-[#f3f4fa]
        border-l border-news-accent/10 w-64 fixed top-0 right-0 h-full
        mt-20 md:mt-24 z-40 shadow-xl shadow-news-accent/5
        hidden md:flex flex-col
      "
      style={{
        backdropFilter: "blur(1.5px)",
      }}
    >
      {/* اللوجو والعنوان */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-2 mb-3 border-b border-gray-200/60">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo"
          className="w-10 h-10 rounded-lg shadow border-2 border-white bg-white object-contain"
        />
        <span className="font-black text-lg text-news-accent tracking-wide drop-shadow-sm select-none">
          المصدر بلس
        </span>
      </div>

      <nav className="flex-1 px-4 py-3">
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

      {/* زخرفة شفافة أسفل الشريط */}
      <div className="mt-auto flex justify-center items-end pb-6 opacity-20 pointer-events-none select-none">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo Decorative"
          className="w-28 h-16 object-contain"
          style={{ filter: "blur(0.5px)" }}
        />
      </div>
    </aside>
  );
};

export default AdminSidebar;
