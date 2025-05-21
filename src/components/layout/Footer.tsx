import { Link } from "react-router-dom";

// مسار اللوجو (تأكد من وجوده في public)
const LOGO_SRC = "/logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#db1f2d] via-[#b70e1f] to-[#3a2327] text-white mt-auto pt-12 pb-0 overflow-hidden shadow-2xl">
      {/* خلفية زخرفية شفافة للوجو */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-10 pointer-events-none select-none z-0 blur-sm">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo Decorative"
          className="w-[420px] h-[180px] mx-auto object-contain"
          draggable={false}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-8">
          {/* عمود التعريف */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <img
                src={LOGO_SRC}
                alt="ALMASDAR PLUS Logo"
                className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg"
              />
              <span className="font-black text-2xl tracking-widest drop-shadow-sm">المصدر بلس</span>
            </div>
            <p className="text-gray-200 text-md leading-relaxed font-medium mb-4">
              المصدر بلس هو موقع إخباري شامل يقدم أحدث الأخبار المحلية والعالمية من قلب الحدث، ويغطي السياسة، الاقتصاد، الرياضة، الفنون والتكنولوجيا برؤية عصرية وحيادية.
            </p>
            <div className="flex gap-3 mt-3">
              {/* روابط سوشيال: استبدل الروابط بما يناسبك */}
              <a
                href="https://facebook.com/almasdarplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl transition"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.525 8.998h-3.027v-1.363c0-.745.494-.919.841-.919.347 0 2.165 0 2.165 0v-3.01l-2.982-.011c-3.318 0-4.092 2.487-4.092 4.084v1.219h-2.017v3.006h2.017v7.002h3.126v-7.002h2.1l.393-3.006z"/></svg>
              </a>
              <a
                href="https://twitter.com/almasdarplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تويتر"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl transition"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.556a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.164-2.724c-.951.564-2.005.974-3.127 1.195a4.918 4.918 0 0 0-8.384 4.482c-4.086-.205-7.713-2.162-10.141-5.134A4.822 4.822 0 0 0 1.671 6.29c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.053 2.28 1.581 4.415 3.949 4.89-.693.189-1.432.232-2.19.084.616 1.926 2.406 3.33 4.523 3.367A9.867 9.867 0 0 1 0 21.543c2.179 1.396 4.768 2.212 7.557 2.212 9.054 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.935 9.935 0 0 0 24 4.556z"/></svg>
              </a>
              <a
                href="https://youtube.com/almasdarplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="يوتيوب"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl transition"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001c-.198-.753-.781-1.343-1.532-1.546-1.353-.365-6.768-.365-6.768-.365s-5.416 0-6.768.365c-.751.203-1.334.793-1.532 1.546-.363 1.36-.363 4.199-.363 4.199s0 2.84.363 4.199c.198.753.781 1.343 1.532 1.546 1.353.365 6.768.365 6.768.365s5.416 0 6.768-.365c.751-.203 1.334-.793 1.532-1.546.363-1.36.363-4.199.363-4.199s0-2.84-.363-4.199zm-12.8 6.199v-4l5 2-5 2z"/></svg>
              </a>
            </div>
          </div>

          {/* عمود الأقسام */}
          <div>
            <h3 className="text-xl font-bold mb-4">أقسام الموقع</h3>
            <ul className="space-y-2 text-gray-100 text-md">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">الرئيسية</Link></li>
              <li><Link to="/news" className="hover:text-yellow-400 transition-colors">الأخبار</Link></li>
              <li><Link to="/politics" className="hover:text-yellow-400 transition-colors">السياسة</Link></li>
              <li><Link to="/economy" className="hover:text-yellow-400 transition-colors">الاقتصاد</Link></li>
              <li><Link to="/videos" className="hover:text-yellow-400 transition-colors">فيديوهات</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">صفحة الاتصال</Link></li>
            </ul>
          </div>

          {/* عمود التواصل */}
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-gray-100 text-md">
              <li>
                <span className="inline-block w-6 text-yellow-300">📧</span>
                <a className="hover:underline hover:text-yellow-400 ml-1" href="mailto:info@almasdarplus.com">
                  info@almasdarplus.com
                </a>
              </li>
              <li>
                <span className="inline-block w-6 text-yellow-300">☎️</span>
                <a className="hover:underline hover:text-yellow-400 ml-1" href="tel:+201234567890">
                  +20 123 456 7890
                </a>
              </li>
              <li>
                <span className="inline-block w-6 text-yellow-300">📍</span>
                القاهرة، مصر
              </li>
            </ul>
          </div>
        </div>

        {/* سطر الحقوق */}
        <div className="border-t border-white/20 mt-8 pt-5 text-center text-gray-200 tracking-wide text-sm flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <span className="font-bold text-yellow-300">المصدر بلس</span>
          </div>
          <div className="flex gap-4 items-center justify-center text-xs">
            <Link to="/privacy" className="hover:text-yellow-400 transition-colors">سياسة الخصوصية</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-yellow-400 transition-colors">الشروط والأحكام</Link>
            <span>|</span>
            <a href="https://wa.me/201234567890" className="hover:text-green-300 transition-colors flex items-center gap-1" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" fill="currentColor" className="inline" viewBox="0 0 24 24"><path d="M12.004 2.003c-5.523 0-10 4.478-10 10 0 1.797.481 3.54 1.396 5.073l-1.452 5.297 5.431-1.423c1.492.817 3.188 1.25 4.94 1.25 5.522 0 10-4.478 10-10s-4.478-10-10-10zm.001 18.163c-1.53 0-3.017-.406-4.292-1.177l-.307-.184-3.225.846.862-3.147-.199-.322c-.861-1.392-1.316-2.998-1.316-4.642 0-4.412 3.588-8 8-8s8 3.588 8 8-3.588 8-8 8zm4.387-5.579c-.24-.12-1.419-.7-1.638-.78-.22-.08-.381-.12-.541.12-.16.239-.62.78-.761.94-.14.16-.28.18-.52.06-.24-.12-1.012-.373-1.927-1.191-.713-.634-1.196-1.417-1.338-1.657-.14-.24-.015-.37.106-.49.11-.11.239-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.299-.74-1.779-.2-.48-.4-.41-.54-.42-.14-.01-.3-.01-.461-.01-.16 0-.42.06-.64.28-.22.22-.84.82-.84 2s.86 2.319.98 2.479c.12.16 1.69 2.6 4.1 3.54.57.2 1.01.32 1.36.41.57.15 1.09.13 1.5.08.46-.07 1.419-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
              تواصل واتساب
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
