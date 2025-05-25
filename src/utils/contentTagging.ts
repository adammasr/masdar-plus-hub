
// Enhanced tag generation with more categories
export const generateContentTags = (content: string, title: string): string[] => {
  const combinedText = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  // AI and Technology
  if (combinedText.match(/(ذكاء اصطناعي|ai|artificial intelligence|machine learning|تعلم آلي)/)) {
    tags.push("ذكاء_اصطناعي");
  }
  
  if (combinedText.match(/(تكنولوجيا|تقنية|technology|tech|رقمي|digital)/)) {
    tags.push("تكنولوجيا");
  }
  
  // Politics and Government
  if (combinedText.match(/(رئيس|وزير|حكومة|برلمان|سياسة|دبلوماسي|president|minister)/)) {
    tags.push("سياسة");
  }
  
  // Economy and Finance
  if (combinedText.match(/(اقتصاد|مالية|استثمار|بورصة|أسهم|بنوك|أسعار|economy|finance)/)) {
    tags.push("اقتصاد");
  }
  
  // Sports
  if (combinedText.match(/(رياضة|كرة|مباراة|لاعب|فريق|بطولة|sports|football|soccer)/)) {
    tags.push("رياضة");
  }
  
  // Health and Medicine
  if (combinedText.match(/(صحة|طب|مرض|علاج|مستشفى|وباء|health|medical|medicine)/)) {
    tags.push("صحة");
  }
  
  // Military and Defense
  if (combinedText.match(/(عسكري|دفاع|أمني|جيش|قوات|military|defense|army|security)/)) {
    tags.push("دفاع_وأمن");
  }
  
  // Science and Research
  if (combinedText.match(/(علم|بحث|دراسة|اكتشاف|science|research|discovery)/)) {
    tags.push("علوم");
  }
  
  // International Affairs
  if (combinedText.match(/(دولي|عالمي|international|global|worldwide)/)) {
    tags.push("شؤون_دولية");
  }
  
  // Add default tag if none detected
  if (tags.length === 0) {
    tags.push("أخبار");
  }
  
  return tags;
};
