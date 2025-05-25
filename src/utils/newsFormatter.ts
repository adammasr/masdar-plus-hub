
// Main newsFormatter file - re-exports all functionality from smaller modules
export {
  reformatArticleWithAI,
  updateArticleDate,
  ensureArticleHasImage,
  translateContent
} from "./articleProcessor";

export {
  extractImageFromContent,
  getContextualImage
} from "./imageExtractor";

export {
  generateContentTags
} from "./contentTagging";

export {
  estimateReadingTime
} from "./textUtils";

export {
  processFacebookPost
} from "./socialProcessor";
