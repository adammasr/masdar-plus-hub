
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-news-DEFAULT text-white mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">عن المصدر بلس</h3>
            <p className="text-gray-300">
              المصدر بلس هو موقع إخباري شامل يقدم أحدث الأخبار المحلية والعالمية في مجالات متنوعة مثل السياسة والاقتصاد والرياضة والفن والتكنولوجيا.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">أقسام الموقع</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-news-accent transition-colors">الرئيسية</Link></li>
              <li><Link to="/news" className="hover:text-news-accent transition-colors">الأخبار</Link></li>
              <li><Link to="/politics" className="hover:text-news-accent transition-colors">السياسة</Link></li>
              <li><Link to="/economy" className="hover:text-news-accent transition-colors">الاقتصاد</Link></li>
              <li><Link to="/videos" className="hover:text-news-accent transition-colors">فيديوهات</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li>البريد الإلكتروني: info@almasdarplus.com</li>
              <li>الهاتف: +20 123 456 7890</li>
              <li><Link to="/contact" className="hover:text-news-accent transition-colors">صفحة الاتصال</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} المصدر بلس</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
