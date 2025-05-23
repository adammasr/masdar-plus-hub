import React from "react";

export interface SidebarAdProps {
  image?: string;
  link?: string;
  label?: string;
  show?: boolean;
}

const SidebarAd: React.FC<SidebarAdProps> = ({
  image = "https://via.placeholder.com/250x250?text=إعلان",
  link = "#",
  label = "إعلان ممول",
  show = true,
}) => {
  if (!show) return null;
  return (
    <aside className="hidden lg:fixed lg:top-24 lg:left-4 lg:w-64 lg:h-80 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center z-40 border border-gray-200">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img
          src={image}
          alt="إعلان"
          className="rounded mb-2 max-w-full max-h-52"
        />
      </a>
      <span className="text-xs text-gray-500">{label}</span>
    </aside>
  );
};

export default SidebarAd;
