
import { Ad } from "./types";

interface AdBannerProps {
  ad: Ad;
}

const AdBanner = ({ ad }: AdBannerProps) => {
  if (!ad.isActive) return null;

  return (
    <div className="ad-banner mb-6 rounded-lg bg-gray-200 p-2 text-center">
      <p className="text-xs text-gray-500 mb-1">إعلان</p>
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="mx-auto max-h-60 w-full object-contain rounded"
            />
          ) : (
            <div className="bg-gray-100 h-28 flex items-center justify-center">
              <span className="text-gray-500">{ad.title}</span>
            </div>
          )}
        </a>
      ) : (
        <div className="bg-gray-100 h-28 flex items-center justify-center rounded">
          <span className="text-gray-500">{ad.title}</span>
        </div>
      )}
    </div>
  );
};

export default AdBanner;
