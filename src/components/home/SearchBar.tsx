
import { Search } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  return (
    <div className="flex items-center gap-2 mb-8 max-w-lg mx-auto">
      <div className="relative flex-1">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن خبر أو كلمة مفتاحية..."
          className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-news-accent"
          aria-label="بحث"
          dir="rtl"
        />
        <Search
          size={18}
          className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
