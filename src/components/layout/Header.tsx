
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "الرئيسية", path: "/" },
    { name: "الأخبار", path: "/news" },
    { name: "السياسة", path: "/politics" },
    { name: "الاقتصاد", path: "/economy" },
    { name: "فيديوهات", path: "/videos" },
    { name: "اتصل بنا", path: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-news-DEFAULT text-white">
      {/* Top Bar */}
      <div className="bg-news-accent py-1 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm">{new Date().toLocaleDateString('ar-EG')}</div>
          <div>
            <Link to="/admin" className="text-sm hover:underline">لوحة التحكم</Link>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2238a7f0-4177-46ef-a6a8-fc8913645906.png" 
              alt="المصدر بلس" 
              className="h-12 md:h-16" 
            />
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-news-muted">
        <div className="container mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-3 text-white block hover:bg-news-accent transition-colors ${
                  isActive(item.path) ? 'bg-news-accent' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-3 text-white block hover:bg-news-accent ${
                    isActive(item.path) ? 'bg-news-accent' : ''
                  }`}
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
