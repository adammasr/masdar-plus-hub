
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending the message
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
      <h1 className="text-3xl font-bold mb-6">اتصل بنا</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">معلومات الاتصال</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">العنوان</h3>
              <p>القاهرة، مصر</p>
            </div>
            <div>
              <h3 className="font-bold">البريد الإلكتروني</h3>
              <p>info@almasdarplus.com</p>
            </div>
            <div>
              <h3 className="font-bold">الهاتف</h3>
              <p>+20 123 456 7890</p>
            </div>
            <div>
              <h3 className="font-bold">ساعات العمل</h3>
              <p>السبت - الخميس: 9:00 ص - 5:00 م</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                الاسم
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                الموضوع
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="أدخل موضوع الرسالة"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                الرسالة
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا"
                rows={5}
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
