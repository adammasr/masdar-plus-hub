
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ArticleSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArticleSearch = ({ searchTerm, onSearchChange }: ArticleSearchProps) => {
  return (
    <div className="flex items-center border rounded-md overflow-hidden mb-4">
      <Search size={20} className="mx-2 text-gray-400" />
      <Input
        type="text"
        placeholder="بحث عن مقال..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default ArticleSearch;
