import { Link } from "react-router-dom";
import { SunMoon } from "lucide-react";
import { useState } from "react";

// Logo path
const LOGO_SRC = "/logo.png";

const Navigation = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="flex items-center justify-between mb-4 py-2 px-2 md:px-6 rounded-lg bg-white/80 dark:bg-gray-900/70 shadow">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-news-accent flex items-center">
          <img src={LOGO_SRC} alt="مصدر بلس" className="w-8 h-8 ml-2" />
          مصدر بلس
        </Link>
        <Link
          to="/news"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          الأخبار
        </Link>
        <Link
          to="/politics"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          السياسة
        </Link>
        <Link
          to="/economy"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          الاقتصاد
        </Link>
        <Link
          to="/sports"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          رياضة
        </Link>
        <Link
          to="/technology"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          تكنولوجيا
        </Link>
        <Link
          to="/cars"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          سيارات
        </Link>
        <Link
          to="/videos"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          فيديوهات
        </Link>
        <Link
          to="/art"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          فن وثقافة
        </Link>
        <Link
          to="/science"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          علوم
        </Link>
        <Link
          to="/education"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          جامعات وتعليم
        </Link>
        <Link
          to="/accidents"
          className="hover:text-news-accent text-gray-600 font-medium"
        >
          حوادث
        </Link>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-news-accent/10"
        title="تبديل الوضع الليلي"
        aria-label="تبديل الوضع الليلي"
      >
        <SunMoon />
      </button>
    </nav>
  );
};

export default Navigation;
