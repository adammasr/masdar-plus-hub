
import { Search, Filter } from "lucide-react";

interface FilterSectionProps {
  search: string;
  setSearch: (search: string) => void;
  sourceFilter: string;
  setSourceFilter: (source: string) => void;
  sources: string[];
}

const FilterSection = ({
  search,
  setSearch,
  sourceFilter,
  setSourceFilter,
  sources
}: FilterSectionProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 mt-6 items-stretch md:items-end">
      <div className="relative flex-1">
        <input
          type="search"
          placeholder="ابحث عن خبر..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-9 py-2 w-full focus:outline-news-accent transition"
          aria-label="بحث عن خبر"
          dir="rtl"
        />
        <Search size={18} className="absolute left-2 top-2.5 text-gray-400 pointer-events-none" />
      </div>
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-gray-400" />
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700"
          aria-label="فلترة المصدر"
        >
          <option value="">كل المصادر</option>
          {sources.map((source, idx) => (
            <option key={idx} value={source}>{source}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSection;
