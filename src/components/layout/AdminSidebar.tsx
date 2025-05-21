
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { title: "لوحة التحكم", path: "/admin" },
    { title: "المقالات", path: "/admin/articles" },
    { title: "إضافة مقال جديد", path: "/admin/articles/new" },
    { title: "روابط RSS", path: "/admin/rss-feeds" },
    { title: "الأقسام", path: "/admin/categories" },
  ];

  return (
    <aside className="bg-white border-l border-gray-200 w-64 fixed top-0 right-0 h-full mt-24 hidden md:block">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-news-accent">لوحة التحكم</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`block px-4 py-2 rounded-md ${
                isActive(item.path)
                  ? "bg-news-accent text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
