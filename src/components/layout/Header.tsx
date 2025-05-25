
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  // قائمة الروابط الأساسية مع الأقسام الجديدة
  const navigation = [
    { name: "الرئيسية", path: "/" },
    { name: "الأخبار", path: "/news" },
    { name: "السياسة", path: "/politics" },
    { name: "الاقتصاد", path: "/economy" },
    { name: "المحافظات", path: "/governorates" },
    { name: "الذكاء الاصطناعي", path: "/ai" },
    { name: "عسكرية", path: "/military" },
    { name: "العالم", path: "/world" },
    { name: "فيديوهات", path: "/videos" },
    { name: "اتصل بنا", path: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // تاريخ اليوم بالعربية
  const todayAr = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-news-DEFAULT text-white shadow-2xl shadow-news-accent/10 relative z-50">
      {/* Top Bar */}
      <div className="bg-news-accent/95 py-1 px-4 select-none border-b border-news-accent/70">
        <div className="container mx-auto flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-white/90 tracking-wide">
            <span className="hidden sm:inline-block font-semibold">
              {todayAr}
            </span>
            <span className="inline-block sm:hidden font-semibold">
              {new Date().toLocaleDateString("ar-EG")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-1 text-xs md:text-sm hover:underline hover:text-yellow-300 transition"
            >
              <LayoutDashboard size={16} className="ml-0.5 inline" />
              لوحة التحكم
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-xs md:text-sm hover:underline hover:text-yellow-300 transition"
            >
              <LogIn size={15} className="ml-0.5 inline" />
              دخول
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - اللوجو واسم الموقع */}
      <div className="container mx-auto py-5 px-4 relative z-10">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/lovable-uploads/2238a7f0-4177-46ef-a6a8-fc8913645906.png"
                alt="المصدر بلس"
                className="h-14 w-14 md:h-20 md:w-20 rounded-xl shadow-lg shadow-news-accent/10 bg-white object-contain border-2 border-white transition group-hover:scale-105"
                style={{ filter: "drop-shadow(0 0 8px #db1f2d22)" }}
                onError={(e) => {
                  console.log('Logo failed to load, using fallback');
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23db1f2d'/%3E%3Ctext x='40' y='45' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E%D8%A7%D9%84%D9%85%D8%B5%D8%AF%D8%B1%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <span className="font-black text-2xl md:text-4xl tracking-wider text-news-accent drop-shadow-lg select-none">
              المصدر بلس
            </span>
          </Link>

          {/* زر القائمة في الموبايل */}
          <button
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-news-accent/40 p-2 rounded"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-news-muted/90 shadow-inner shadow-news-accent/5 relative z-20 border-b border-news-accent/10">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  px-4 py-3 text-white font-semibold rounded-t-xl transition-colors duration-150 whitespace-nowrap
                  ${
                    isActive(item.path)
                      ? "bg-news-accent shadow text-yellow-300"
                      : "hover:bg-news-accent/70 hover:text-yellow-200"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden animate-fade-in bg-news-muted/95 rounded-b-lg shadow-inner shadow-news-accent/10 border-t border-news-accent/15">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    block px-5 py-4 font-semibold text-white transition-colors
                    ${isActive(item.path) ? "bg-news-accent text-yellow-300" : "hover:bg-news-accent/70 hover:text-yellow-200"}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
