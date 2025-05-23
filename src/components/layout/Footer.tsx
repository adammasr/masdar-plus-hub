
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone,
  MapPin,
  Rss
} from "lucide-react";

// استخدام نفس مسار الشعار من الهيدر
const LOGO_SRC = "/lovable-uploads/2238a7f0-4177-46ef-a6a8-fc8913645906.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* معلومات الموقع */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src={LOGO_SRC} 
                alt="مصدر بلس" 
                className="w-10 h-10 ml-3 rounded-lg object-contain bg-white/10 p-1" 
                onError={(e) => {
                  console.log('Footer logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h3 className="text-2xl font-bold">مصدر بلس</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              منصة إخبارية متطورة تعتمد على الذكاء الاصطناعي لتقديم أحدث الأخبار العالمية والمحلية 
              بسرعة ودقة. نركز على التكنولوجيا، الذكاء الاصطناعي، والشؤون العسكرية والرياضة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Rss size={24} />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-white transition-colors">الأخبار</Link></li>
              <li><Link to="/politics" className="text-gray-300 hover:text-white transition-colors">السياسة</Link></li>
              <li><Link to="/economy" className="text-gray-300 hover:text-white transition-colors">الاقتصاد</Link></li>
              <li><Link to="/videos" className="text-gray-300 hover:text-white transition-colors">الفيديوهات</Link></li>
            </ul>
          </div>

          {/* معلومات قانونية */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات قانونية</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">من نحن</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">شروط الاستخدام</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">اتصل بنا</Link></li>
            </ul>
            
            <div className="mt-6">
              <div className="flex items-center text-gray-300 mb-2">
                <Mail size={16} className="ml-2" />
                <span className="text-sm">info@masdarplus.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin size={16} className="ml-2" />
                <span className="text-sm">الشرق الأوسط</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 مصدر بلس. جميع الحقوق محفوظة. مدعوم بالذكاء الاصطناعي.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            المحتوى المنشور يتم معالجته وإعادة صياغته باستخدام تقنيات الذكاء الاصطناعي المتطورة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
