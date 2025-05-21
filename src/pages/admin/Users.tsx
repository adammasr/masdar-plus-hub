import { useState, useEffect } from "react";

type User = {
  username: string;
  password: string;
};

const USERS_KEY = "adminUsers";

const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [{ username: "admin", password: "yourStrongPassword" }];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMessage("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    if (users.find(u => u.username === username)) {
      setMessage("اسم المستخدم موجود بالفعل");
      return;
    }
    const newUsers = [...users, { username, password }];
    saveUsers(newUsers);
    setUsers(newUsers);
    setUsername("");
    setPassword("");
    setMessage("تمت إضافة المستخدم بنجاح");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">إدارة المستخدمين</h2>
      <form onSubmit={addUser} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button className="bg-blue-600 text-white px-4 rounded" type="submit">إضافة</button>
      </form>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <h3 className="text-lg font-semibold mb-2">قائمة المستخدمين</h3>
      <ul className="list-disc pl-6">
        {users.map((u, i) => (
          <li key={u.username}>{u.username} {i === 0 && "(مسؤول رئيسي)"}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
