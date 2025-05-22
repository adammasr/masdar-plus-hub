import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setIsLoading(true);

    // Here you might want to POST to an API instead of setTimeout
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم إرسال رسالتك بنجاح، وسنقوم بالرد عليك قريبًا");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-right">اتصل بنا</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-4">معلومات الاتصال</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">العنوان</h3>
              <p>القاهرة، مصر</p>
            </div>
            <div>
              <h3 className="font-bold">البريد الإلكتروني</h3>
              <a href="mailto:info@almasdarplus.com" className="text-blue-600 hover:underline">
                info@almasdarplus.com
              </a>
            </div>
            <div>
              <h3 className="font-bold">الهاتف</h3>
              {/* إذا كان هناك رقم هاتف اكتبه هنا */}
              <p>+20 123 456 789</p>
            </div>
            <div>
              <h3 className="font-bold">ساعات العمل</h3>
              <p>السبت - الخميس: 9:00 ص - 5:00 م</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-right">أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="name">
                الاسم
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                autoComplete="name"
                dir="auto"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="email">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                autoComplete="email"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="subject">
                الموضوع
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="أدخل موضوع الرسالة"
                dir="auto"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="message">
                الرسالة
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا"
                rows={5}
                dir="auto"
              />
            </div>
            <Button
              type="submit"
              className="bg-news-accent hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
