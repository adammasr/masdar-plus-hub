
// Ad positions available in the application
export type AdPosition = "header" | "footer" | "sidebar" | "article" | "before-content" | "after-content";

// Ad structure
export interface Ad {
  id: string;
  title: string;
  imageUrl?: string;
  linkUrl?: string;
  position: AdPosition;
  isActive: boolean;
}

// Configuration for where ads should appear
export interface AdConfig {
  enableHeaderAds: boolean;
  enableFooterAds: boolean;
  enableSidebarAds: boolean;
  enableArticleAds: boolean;
}
