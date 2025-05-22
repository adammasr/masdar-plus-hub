
import { Ad } from "../components/ads/types";

// Sample ads data
const ads: Ad[] = [
  {
    id: "1",
    title: "إعلان رئيسي",
    imageUrl: "/placeholder.svg",
    linkUrl: "https://example.com",
    position: "header",
    isActive: true,
  },
  {
    id: "2",
    title: "إعلان الشريط الجانبي",
    imageUrl: "/placeholder.svg",
    linkUrl: "https://example.com",
    position: "sidebar",
    isActive: true,
  },
  {
    id: "3",
    title: "إعلان بين المقالات المميزة",
    imageUrl: "/placeholder.svg",
    linkUrl: "https://example.com",
    position: "between-featured",
    isActive: true,
  },
  {
    id: "4",
    title: "إعلان أعلى الشريط الجانبي",
    imageUrl: "/placeholder.svg",
    linkUrl: "https://example.com",
    position: "sidebar-top",
    isActive: true,
  },
  {
    id: "5",
    title: "إعلان أسفل الشريط الجانبي",
    imageUrl: "/placeholder.svg",
    linkUrl: "https://example.com",
    position: "sidebar-bottom",
    isActive: true,
  },
];

export default ads;
