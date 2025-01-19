import { cn, fetcher } from "@/lib/utils";
import useSWR from "swr";

const Sidebar = ({
  selectedCategory,
  onCategorySelect,
}: {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}) => {
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR<{ category: string; count: number }[]>(
    "http://localhost:5000/api/products/categories",
    fetcher
  );

  if (categoriesLoading) {
    return <div className="p-5">Loading...</div>;
  }

  if (categoriesError) {
    return <div className="p-5 text-red-500">Error loading data</div>;
  }

  return (
    <div className="p-5 min-w-[200px] border-r">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        {selectedCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {categories?.map((category, index) => (
          <li
            key={index}
            onClick={() => onCategorySelect(category.category)}
            className={cn(
              "cursor-pointer py-2 px-3 rounded-md transition-colors flex justify-between",
              selectedCategory === category.category
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <span>
              {category.category} ({category.count})
            </span>
            {selectedCategory === category.category && (
              <span className="text-blue-500">✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
