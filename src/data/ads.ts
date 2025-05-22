export interface Ad {
  id: string;
  title: string;
  image?: string;
  url?: string;
  description?: string;
  position?: "sidebar" | "header" | "footer" | "inline";
  isActive?: boolean;
}

export const ads: Ad[] = [
  {
    id: "1",
    title: "إعلان تجريبي - إعلانك هنا!",
    image: "/ads/sample1.png", // ضع صورة إعلانية مناسبة أو احذف السطر لو لا تريد صورة
    url: "https://example.com",
    description: "اعلن معنا في المصدر بلس وحقق أفضل وصول لجمهورك!",
    position: "sidebar",
    isActive: true,
  },
  // يمكنك إضافة المزيد من الإعلانات هنا
];
