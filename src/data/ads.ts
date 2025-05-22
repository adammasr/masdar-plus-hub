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
    title: "إعلان تجريبي - أعلن هنا!",
    image: "/ads/sample.png",
    url: "https://example.com",
    description: "اعلن معنا على المصدر بلس للحصول على أفضل النتائج.",
    position: "sidebar",
    isActive: true,
  },
];
