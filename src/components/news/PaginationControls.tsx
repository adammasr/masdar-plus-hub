
interface PaginationControlsProps {
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}

const PaginationControls = ({ page, pageCount, setPage }: PaginationControlsProps) => {
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        aria-label="الصفحة السابقة"
      >
        السابق
      </button>
      {[...Array(pageCount)].map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded-md border ${page === i + 1 ? "bg-news-accent text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
          onClick={() => setPage(i + 1)}
          aria-label={`الانتقال إلى صفحة ${i + 1}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={page === pageCount}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        aria-label="الصفحة التالية"
      >
        التالي
      </button>
    </div>
  );
};

export default PaginationControls;
