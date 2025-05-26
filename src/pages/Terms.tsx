
import { useEffect } from "react";
import { Card } from "@/components/ui/card";

const Terms = () => {
  useEffect(() => {
    document.title = "شروط الاستخدام | مصدر بلس";
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          شروط الاستخدام
        </h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">قبول الشروط</h2>
            <p>
              باستخدامك لموقع مصدر بلس، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">وصف الخدمة</h2>
            <p>
              مصدر بلس هو موقع إخباري يقدم أحدث الأخبار المصرية والعربية والعالمية في مختلف المجالات بما في ذلك السياسة والاقتصاد والرياضة والتكنولوجيا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">استخدام الموقع</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>يجب استخدام الموقع للأغراض القانونية فقط</li>
              <li>لا يجوز استخدام الموقع لنشر محتوى مسيء أو مضلل</li>
              <li>لا يجوز محاولة اختراق أو تعطيل الموقع</li>
              <li>يجب احترام حقوق الملكية الفكرية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">المحتوى</h2>
            <p>
              جميع المحتوى المنشور على الموقع محمي بحقوق الطبع والنشر. يمكنك قراءة ومشاركة المقالات للاستخدام الشخصي غير التجاري مع ذكر المصدر.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">دقة المعلومات</h2>
            <p>
              نسعى لتقديم معلومات دقيقة وموثوقة، لكننا لا نضمن دقة أو اكتمال المعلومات المنشورة. يتحمل المستخدم مسؤولية التحقق من صحة المعلومات.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">الإعلانات</h2>
            <p>
              قد يحتوي الموقع على إعلانات من طرف ثالث. نحن لسنا مسؤولين عن محتوى هذه الإعلانات أو الخدمات المعلن عنها.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">إخلاء المسؤولية</h2>
            <p>
              الموقع متاح "كما هو" دون أي ضمانات. نحن لسنا مسؤولين عن أي أضرار قد تنتج عن استخدام الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">التعديلات</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستصبح التعديلات سارية فور نشرها على الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">القانون المطبق</h2>
            <p>
              تخضع هذه الشروط للقوانين المصرية، وتحل أي نزاعات أمام المحاكم المصرية المختصة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">الاتصال</h2>
            <p>
              لأي استفسارات حول شروط الاستخدام، يمكنك الاتصال بنا عبر صفحة الاتصال.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
        </div>
      </Card>
    </div>
  );
};

export default Terms;
