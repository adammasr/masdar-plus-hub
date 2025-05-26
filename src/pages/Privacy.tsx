
import { useEffect } from "react";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  useEffect(() => {
    document.title = "سياسة الخصوصية | مصدر بلس";
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          سياسة الخصوصية
        </h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">مقدمة</h2>
            <p>
              نحن في موقع مصدر بلس نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">المعلومات التي نجمعها</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>معلومات التصفح الأساسية مثل عنوان IP والمتصفح المستخدم</li>
              <li>ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح</li>
              <li>المعلومات التي تقدمها طوعياً عند الاتصال بنا</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">كيفية استخدام المعلومات</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>تحسين محتوى الموقع وتجربة المستخدم</li>
              <li>إحصائيات حول استخدام الموقع</li>
              <li>الرد على استفساراتك وطلباتك</li>
              <li>تخصيص المحتوى والإعلانات</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">مشاركة المعلومات</h2>
            <p>
              نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>عند الحصول على موافقتك الصريحة</li>
              <li>عند الحاجة للامتثال للقوانين أو الأحكام القضائية</li>
              <li>لحماية حقوقنا أو سلامة المستخدمين</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">حماية البيانات</h2>
            <p>
              نستخدم تدابير أمنية متقدمة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الكشف أو التدمير.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">ملفات تعريف الارتباط</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. يمكنك تعطيل هذه الملفات من خلال إعدادات متصفحك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">حقوقك</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الحق في الوصول إلى معلوماتك الشخصية</li>
              <li>الحق في تصحيح أو تحديث معلوماتك</li>
              <li>الحق في طلب حذف معلوماتك</li>
              <li>الحق في الاعتراض على معالجة معلوماتك</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">التحديثات</h2>
            <p>
              قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ التحديث.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">اتصل بنا</h2>
            <p>
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك الاتصال بنا عبر صفحة الاتصال.
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

export default Privacy;
