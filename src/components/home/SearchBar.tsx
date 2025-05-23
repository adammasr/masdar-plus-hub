
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // اقتراحات البحث الشائعة
  const popularSearches = [
    "ذكاء اصطناعي", "تكنولوجيا", "سياسة", "اقتصاد", "رياضة"
  ];

  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="ابحث في الأخبار والمقالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-12 pl-12 h-12 text-lg border-2 border-gray-200 focus:border-news-accent rounded-full"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* اقتراحات البحث */}
        {!search && (
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm mb-2">بحث شائع:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map(term => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-news-accent hover:text-white transition-colors"
                  onClick={() => setSearch(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
