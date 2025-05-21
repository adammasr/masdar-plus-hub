import React from "react";

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحيرة",
  "الشرقية",
  "المنوفية",
  "القليوبية",
  "الغربية",
  "كفر الشيخ",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
  "الوادي الجديد",
  "البحر الأحمر"
];

const Governorates: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">المحافظات المصرية</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {governorates.map((gov) => (
        <div
          key={gov}
          className="bg-white shadow-md rounded-lg p-6 text-center hover:bg-blue-50 transition-colors duration-200"
        >
          <span className="text-xl font-semibold text-gray-800">{gov}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Governorates;
