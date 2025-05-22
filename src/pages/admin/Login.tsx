import { useState } from "react";
import { useNavigate } from "react-router-dom";

const USER = "admin";
const PASS = "01208213342tozfek400";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ننظف بيانات الأدمن القديمة أولاً لمنع التعارض
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");

    if (username === USER && password === PASS) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("username", "adammasr");
      navigate("/admin");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 shadow rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول للوحة التحكم</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          دخول
        </button>
      </form>
    </div>
  );
};

export default Login;
