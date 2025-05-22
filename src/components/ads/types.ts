
// Define the ad position types
export type AdPosition = 
  | "header" 
  | "footer" 
  | "sidebar" 
  | "inline" 
  | "between-featured" 
  | "sidebar-top" 
  | "sidebar-bottom";

// This interface makes sure we're consistent with the Ad type across the application
export interface Ad {
  id: string;
  title: string;
  imageUrl?: string;
  linkUrl?: string;
  position: AdPosition;
  isActive: boolean;
}
